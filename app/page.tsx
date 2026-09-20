"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { DifferencePoint, minhwaList, talkQuestions } from "@/src/data/minhwa";

type Screen = "home" | "select" | "intro" | "game" | "learn";
type CompletionMap = Record<string, boolean>;
type ArtworkTap = { x: number; y: number; width: number; height: number };
const STORAGE_KEY = "minhwa-detective-completions";
const TOUCH_PADDING_PERCENT = 1.5;
const MIN_TOUCH_RADIUS_PX = 26;

async function makeLineArt(source: string): Promise<string> {
  const image = new Image();
  image.decoding = "async";
  image.src = source;
  await image.decode();

  const longestSide = 1600;
  const scale = Math.min(1, longestSide / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("색칠 도안을 만들 수 없습니다.");

  canvas.width = width;
  canvas.height = height;
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);
  const sourcePixels = context.getImageData(0, 0, width, height);
  const gray = new Float32Array(width * height);
  for (let pixel = 0, index = 0; index < gray.length; pixel += 4, index += 1) {
    gray[index] = sourcePixels.data[pixel] * .299 + sourcePixels.data[pixel + 1] * .587 + sourcePixels.data[pixel + 2] * .114;
  }

  const softened = new Float32Array(gray.length);
  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      let sum = 0;
      for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
        for (let offsetX = -1; offsetX <= 1; offsetX += 1) sum += gray[(y + offsetY) * width + x + offsetX];
      }
      softened[y * width + x] = sum / 9;
    }
  }

  const output = context.createImageData(width, height);
  output.data.fill(255);
  const valueAt = (x: number, y: number) => softened[y * width + x];
  for (let y = 2; y < height - 2; y += 1) {
    for (let x = 2; x < width - 2; x += 1) {
      const gx = -valueAt(x - 1, y - 1) + valueAt(x + 1, y - 1)
        - 2 * valueAt(x - 1, y) + 2 * valueAt(x + 1, y)
        - valueAt(x - 1, y + 1) + valueAt(x + 1, y + 1);
      const gy = -valueAt(x - 1, y - 1) - 2 * valueAt(x, y - 1) - valueAt(x + 1, y - 1)
        + valueAt(x - 1, y + 1) + 2 * valueAt(x, y + 1) + valueAt(x + 1, y + 1);
      const ink = Math.hypot(gx, gy) > 52 ? 20 : 255;
      const position = (y * width + x) * 4;
      output.data[position] = ink;
      output.data[position + 1] = ink;
      output.data[position + 2] = ink;
      output.data[position + 3] = 255;
    }
  }
  context.putImageData(output, 0, 0);
  return canvas.toDataURL("image/png");
}

function PngIcon({ name, className = "" }: { name: string; className?: string }) {
  return <img className={`png-icon ${className}`.trim()} src={`/icons/${name}.png`} alt="" aria-hidden="true" draggable={false} />;
}

function loadCompletions(): CompletionMap {
  if (typeof window === "undefined") return {};
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as Record<string, unknown>;
    return Object.fromEntries(Object.entries(stored).map(([id, value]) => [id, value === true || (Array.isArray(value) && value.length > 0)]));
  } catch { return {}; }
}

function playTone(enabled: boolean, kind: "correct" | "complete") {
  if (!enabled || typeof window === "undefined") return;
  const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(kind === "correct" ? 660 : 523, context.currentTime);
  if (kind === "complete") oscillator.frequency.linearRampToValueAtTime(784, context.currentTime + .22);
  gain.gain.setValueAtTime(.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(.11, context.currentTime + .025);
  gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + (kind === "correct" ? .2 : .42));
  oscillator.connect(gain).connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + (kind === "correct" ? .22 : .45));
}

export default function HomePage() {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedId, setSelectedId] = useState(minhwaList[0].id);
  const [found, setFound] = useState<number[]>([]);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [hintIndex, setHintIndex] = useState<number | null>(null);
  const [gentleMessage, setGentleMessage] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [completed, setCompleted] = useState<CompletionMap>({});
  const [celebrate, setCelebrate] = useState(false);
  const [teacherOpen, setTeacherOpen] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [preparingPrint, setPreparingPrint] = useState(false);
  const [printImage, setPrintImage] = useState<string | null>(null);
  const [coloringPreviewOpen, setColoringPreviewOpen] = useState(false);
  const selected = minhwaList.find((item) => item.id === selectedId) || minhwaList[0];
  const points = selected.differences;

  useEffect(() => setCompleted(loadCompletions()), []);
  useEffect(() => () => window.speechSynthesis?.cancel(), []);
  useEffect(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, [selectedId, screen]);

  const toggleNarration = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (window.speechSynthesis.speaking || speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(`${selected.title}. ${selected.description}`);
    utterance.lang = "ko-KR";
    utterance.rate = .86;
    utterance.pitch = 1.05;
    const koreanVoice = window.speechSynthesis.getVoices().find((voice) => voice.lang.toLowerCase().startsWith("ko"));
    if (koreanVoice) utterance.voice = koreanVoice;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const openColoringPreview = async () => {
    if (preparingPrint) return;
    setPreparingPrint(true);
    try {
      const lineArt = await makeLineArt(selected.originalImage);
      setPrintImage(lineArt);
      setColoringPreviewOpen(true);
    } finally {
      setPreparingPrint(false);
    }
  };

  const printColoringPage = () => {
    window.setTimeout(() => window.print(), 120);
  };

  const chooseArtwork = (id: string) => {
    setSelectedId(id); setScreen("intro"); window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const startGame = () => {
    setFound([]); setHintsLeft(3); setHintIndex(null);
    setGentleMessage(false); setCelebrate(false); setScreen("game");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const markComplete = () => {
    const current = loadCompletions();
    const next = { ...current, [selected.id]: true };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setCompleted(next); playTone(soundOn, "complete"); setCelebrate(true);
  };
  const handleArtTap = ({ x, y, width, height }: ArtworkTap) => {
    const hitOrder = hintIndex === null
      ? points.map((_, index) => index)
      : [hintIndex, ...points.map((_, index) => index).filter((index) => index !== hintIndex)];
    const hit = hitOrder.find((index) => {
      const point = points[index];
      if (found.includes(index)) return false;
      const hintPadding = index === hintIndex ? 3 : 0;
      const radiusX = Math.max(point.radius + TOUCH_PADDING_PERCENT + hintPadding, (MIN_TOUCH_RADIUS_PX / width) * 100);
      const radiusY = Math.max(point.radius + TOUCH_PADDING_PERCENT + hintPadding, (MIN_TOUCH_RADIUS_PX / height) * 100);
      return Math.hypot((x - point.x) / radiusX, (y - point.y) / radiusY) <= 1;
    });
    if (hit !== undefined) {
      const next = [...found, hit];
      setFound(next); setHintIndex(null); setGentleMessage(false); playTone(soundOn, "correct");
      if (next.length === points.length) window.setTimeout(markComplete, 420);
    } else {
      setGentleMessage(true); window.setTimeout(() => setGentleMessage(false), 1700);
    }
  };
  const showHint = () => {
    if (hintsLeft <= 0) return;
    const unseen = points.map((_, index) => index).filter((index) => !found.includes(index));
    if (!unseen.length) return;
    const index = unseen[Math.floor(Math.random() * unseen.length)];
    setHintIndex(index); setHintsLeft((value) => value - 1);
    window.setTimeout(() => setHintIndex((current) => current === index ? null : current), 2000);
  };
  const goLearn = () => {
    setQuestionIndex(Math.floor(Math.random() * talkQuestions.length));
    setCelebrate(false); setScreen("learn"); window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setScreen("home")} aria-label="첫 화면으로 이동">
          <img className="brand-mark" src="/icons/brand.png" alt="" aria-hidden="true" draggable={false} /><span>민화 탐정</span>
        </button>
        <div className="top-actions">
          <button className="icon-control" onClick={() => setSoundOn((value) => !value)} aria-label={soundOn ? "효과음 끄기" : "효과음 켜기"}><PngIcon name={soundOn ? "sound-on" : "sound-off"} /></button>
          <button className="icon-control" onClick={() => document.documentElement.requestFullscreen?.()} aria-label="전체 화면으로 보기"><PngIcon name="fullscreen" /></button>
          <button className="icon-control teacher-button" onClick={() => setTeacherOpen(true)} aria-label="교사용 설정 열기"><PngIcon name="settings" /></button>
        </div>
      </header>

      {screen === "home" && <section className="home-screen page-frame">
        <div className="home-copy">
          <span className="eyebrow">우리 그림 관찰 놀이</span>
          <h1>민화 속<br /><em>다른 곳</em>을 찾아라!</h1>
          <p>민화를 자세히 보고 다른 곳을 찾아보세요.</p>
          <Button className="primary-cta" onClick={() => setScreen("select")} aria-label="민화 놀이 시작하기">놀이 시작 <PngIcon name="arrow-right" /></Button>
        </div>
        <div className="home-art" aria-label="민화 미리보기">
          <div className="art-window art-window-main"><img src={minhwaList[0].originalImage} alt="수박과 들쥐 그림" /></div>
          <div className="art-window art-window-small"><img src={minhwaList[2].originalImage} alt="표범과 모란 민화" /></div>
          <span className="look-ring ring-one" aria-hidden="true" /><span className="look-ring ring-two" aria-hidden="true" />
        </div>
      </section>}

      {screen === "select" && <section className="page-frame selection-screen">
        <div className="section-heading"><div><span className="eyebrow">어떤 그림을 살펴볼까요?</span><h1>민화를 골라 주세요</h1></div><p>그림을 누르면 먼저 천천히 관찰할 수 있어요.</p></div>
        <div className="art-grid">
          {minhwaList.map((item, index) => {
            const done = !!completed[item.id];
            return <button key={item.id} className="art-card" onClick={() => chooseArtwork(item.id)} aria-label={`${item.title} 살펴보기${done ? ", 완료함" : ""}`}>
              <span className="card-footer"><span className="card-title-row"><span className="card-number">{String(index + 1).padStart(2, "0")}</span><strong>{item.title}</strong></span>{done && <span className="done-badge"><PngIcon name="check" /> 찾아봤어요</span>}</span>
              <span className="card-image"><img src={item.originalImage} alt={`${item.title} 민화`} /></span>
            </button>;
          })}
        </div>
      </section>}

      {screen === "intro" && <section className="page-frame observation-screen">
        <BackButton label="민화 고르기" onClick={() => setScreen("select")} />
        <div className="observation-layout">
          <div className="intro-image"><img src={selected.originalImage} alt={`${selected.title} 원본 민화`} /></div>
          <div className="intro-copy"><span className="eyebrow">먼저 그림을 천천히 봐요</span><h1>{selected.title}</h1><p className="intro-summary">{selected.shortDescription}</p><p className="intro-description">{selected.description}</p>
            <div className="intro-tools">
              <Button variant="outline" className="large-control" onClick={toggleNarration} aria-label={speaking ? "그림 설명 그만 듣기" : "그림 설명 음성으로 듣기"}><PngIcon name={speaking ? "sound-off" : "sound-on"} /> {speaking ? "그만 듣기" : "설명 듣기"}</Button>
              <Button variant="outline" className="large-control" onClick={openColoringPreview} disabled={preparingPrint} aria-label="선택한 그림의 색칠 도안 미리보기"><PngIcon name="paintbrush" /> {preparingPrint ? "색칠 그림 만드는 중" : "색칠 그림 미리보기"}</Button>
            </div>
            <Button className="primary-cta wide" onClick={startGame} aria-label="다른 곳 5개 찾기 시작">다른 곳 5개 찾기 <PngIcon name="arrow-right" /></Button>
          </div>
        </div>
      </section>}

      {screen === "game" && <section className="game-screen page-frame wide-frame">
        <div className="game-heading">
          <BackButton label="그림 다시 보기" onClick={() => setScreen("intro")} />
          <div><span className="eyebrow game-eyebrow"><PngIcon name="hand-tap" /> 다른 곳 5개 찾기</span><h1>{selected.title}</h1><p>원래 그림과 비교해 보고, 오른쪽 다른 그림에서 달라진 곳을 눌러요.</p></div>
          <div className="progress-pill" aria-live="polite"><span>찾은 곳</span><strong>{found.length} / {points.length}</strong></div>
        </div>
        <div className="progress-track" aria-hidden="true"><span style={{ width: `${(found.length / points.length) * 100}%` }} /></div>
        <div className="game-grid">
          <ArtworkPanel label="원래 그림 · 살펴봐요" image={selected.originalImage} alt={`${selected.title} 원래 그림`} />
          <ArtworkPanel label="다른 그림 · 여기를 눌러요" image={selected.differenceImage} alt={`${selected.title} 다른 그림`} interactive onTap={handleArtTap} points={points} hintIndex={hintIndex} shake={gentleMessage} />
        </div>
        <div className="game-controls">
          <Button variant="outline" className="large-control" onClick={showHint} disabled={hintsLeft === 0 || found.length === points.length} aria-label={`힌트 보기, ${hintsLeft}개 남음`}><PngIcon name="lightbulb" /> 힌트 <span className="control-count">{hintsLeft}</span></Button>
          <p className={`gentle-message ${gentleMessage ? "show" : ""}`} aria-live="polite">물결처럼 천천히, 조금 더 자세히 살펴볼까요?</p>
          <Button variant="outline" className="large-control" onClick={startGame} aria-label="같은 그림 다시 시작"><PngIcon name="reset" /> 다시 하기</Button>
        </div>
      </section>}

      {screen === "learn" && <section className="page-frame learn-screen">
        <BackButton label="민화 고르기" onClick={() => setScreen("select")} />
        <div className="learn-heading"><span className="eyebrow">민화 더 알아보기</span><h1>이 민화를 다시 살펴볼까요?</h1></div>
        <div className="learn-layout">
          <div className="learn-image"><img src={selected.originalImage} alt={`${selected.title} 민화 다시 보기`} /></div>
          <div className="learn-copy"><h2>{selected.title}</h2>
            <div className="observation-list"><h3>그림 속에서 찾아보세요</h3><ul>{selected.observationPoints.map((point) => <li key={point}><PngIcon name="check-circle" /> {point}</li>)}</ul></div>
            <div className="story-box"><h3>이 그림에는 어떤 이야기가 있을까요?</h3><p>{selected.description}</p></div>
            <div className="talk-card"><span>함께 이야기해요</span><strong>{talkQuestions[questionIndex]}</strong></div>
            <div className="learn-actions"><Button className="primary-cta" onClick={() => setScreen("select")}><PngIcon name="gallery" /> 다른 민화 찾기</Button><Button variant="outline" className="large-control" onClick={startGame}><PngIcon name="reset" /> 다시 하기</Button></div>
          </div>
        </div>
      </section>}

      <Dialog open={celebrate} onOpenChange={setCelebrate}><DialogContent className="celebration-dialog" showCloseButton={false}>
        <DialogHeader className="items-center text-center"><DialogTitle>민화 탐정 성공!</DialogTitle><DialogDescription>다른 곳을 모두 찾았어요!</DialogDescription></DialogHeader>
        <div className="celebration-actions"><Button className="primary-cta" onClick={goLearn}><PngIcon name="book" /> 민화 더 알아보기</Button><Button variant="outline" className="large-control" onClick={() => { setCelebrate(false); setScreen("select"); }}><PngIcon name="gallery" /> 다른 민화 찾기</Button><Button variant="ghost" className="large-control" onClick={startGame}><PngIcon name="reset" /> 다시 하기</Button></div>
      </DialogContent></Dialog>
      <TeacherEditor open={teacherOpen} onOpenChange={setTeacherOpen} />
      <Dialog open={coloringPreviewOpen} onOpenChange={setColoringPreviewOpen}>
        <DialogContent className="coloring-preview-dialog" showCloseButton={false}>
          <button className="teacher-close" onClick={() => setColoringPreviewOpen(false)} aria-label="색칠 그림 미리보기 닫기"><PngIcon name="close" /></button>
          <DialogHeader>
            <DialogTitle>색칠 그림 미리보기</DialogTitle>
            <DialogDescription>{selected.title} 도안을 확인한 뒤 인쇄해 주세요.</DialogDescription>
          </DialogHeader>
          <div className="coloring-preview-canvas">
            {printImage && <img src={printImage} alt={`${selected.title} 색칠 도안 미리보기`} />}
          </div>
          <div className="coloring-preview-actions">
            <Button className="primary-cta" onClick={printColoringPage}><PngIcon name="copy" /> 인쇄하기</Button>
            <Button variant="outline" className="large-control" onClick={() => setColoringPreviewOpen(false)}><PngIcon name="close" /> 닫기</Button>
          </div>
        </DialogContent>
      </Dialog>
      <section className="print-sheet" aria-label={`${selected.title} 색칠 도안`}>
        <header><span>민화 색칠 놀이</span><h1>{selected.title}</h1></header>
        {printImage && <img src={printImage} alt={`${selected.title} 색칠 도안`} />}
        <p>이름: ____________________</p>
      </section>
    </main>
  );
}

function BackButton({ label, onClick }: { label: string; onClick: () => void }) {
  return <button className="back-button" onClick={onClick}><PngIcon name="arrow-left" /> {label}</button>;
}

function ArtworkPanel({ label, image, alt, interactive = false, onTap, points = [], hintIndex = null, shake = false }: {
  label: string; image: string; alt: string; interactive?: boolean; onTap?: (tap: ArtworkTap) => void;
  points?: DifferencePoint[]; hintIndex?: number | null; shake?: boolean;
}) {
  const imageRef = useRef<HTMLImageElement>(null);
  const handleTap = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const rect = imageRef.current?.getBoundingClientRect();
    if (!rect || !onTap || rect.width <= 0 || rect.height <= 0) return;
    const clientX = event.clientX;
    const clientY = event.clientY;
    if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) return;
    onTap({
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
      width: rect.width,
      height: rect.height,
    });
  };
  return <figure className="art-panel"><figcaption>{label}</figcaption><div className={`game-art ${shake ? "soft-shake" : ""}`}>
    <img ref={imageRef} src={image} alt={alt} draggable={false} />
    {interactive && <button type="button" className="tap-layer" onPointerDown={handleTap} aria-label="다른 그림에서 달라 보이는 부분을 눌러 주세요">
      {points.map((point, index) => hintIndex === index
        ? <span key={index} className="hint-glow" style={{ left: `${point.x}%`, top: `${point.y}%`, width: `${point.radius * 2}%`, aspectRatio: "1" }} /> : null)}
    </button>}
  </div></figure>;
}

function TeacherEditor({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [artworkId, setArtworkId] = useState(minhwaList[0].id);
  const [radius, setRadius] = useState(6);
  const selected = useMemo(() => minhwaList.find((item) => item.id === artworkId) || minhwaList[0], [artworkId]);
  const [editorPoints, setEditorPoints] = useState<DifferencePoint[]>(selected.differences);
  const [copied, setCopied] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  useEffect(() => setEditorPoints(selected.differences), [selected]);
  const addPoint = (event: React.PointerEvent<HTMLButtonElement>) => {
    const image = imageRef.current; if (!image) return;
    const rect = image.getBoundingClientRect();
    setEditorPoints((items) => [...items, { x: Number((((event.clientX - rect.left) / rect.width) * 100).toFixed(1)), y: Number((((event.clientY - rect.top) / rect.height) * 100).toFixed(1)), radius }]);
  };
  const json = JSON.stringify(editorPoints, null, 2);
  const copyJson = async () => {
    await navigator.clipboard.writeText(json); setCopied(true); window.setTimeout(() => setCopied(false), 1400);
  };
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="teacher-dialog" showCloseButton={false}>
    <button className="teacher-close" onClick={() => onOpenChange(false)} aria-label="교사용 설정 닫기"><PngIcon name="close" /></button>
    <DialogHeader><DialogTitle>교사용 정답 위치 설정</DialogTitle><DialogDescription>다른 그림에서 찾을 5곳의 좌표를 조정할 수 있어요.</DialogDescription></DialogHeader>
    <div className="teacher-toolbar">
      <label>민화<Select value={artworkId} onValueChange={setArtworkId}><SelectTrigger className="teacher-select"><SelectValue /></SelectTrigger><SelectContent>{minhwaList.map((item) => <SelectItem key={item.id} value={item.id}>{item.title}</SelectItem>)}</SelectContent></Select></label>
      <label className="radius-control">영역 크기 <strong>{radius}%</strong><Slider value={[radius]} min={3} max={9} step={1} onValueChange={(value) => setRadius(value[0])} aria-label="정답 영역 크기" /></label>
    </div>
    <div className="teacher-grid">
      <div className="teacher-image"><img ref={imageRef} src={selected.differenceImage} alt={`${selected.title} 정답 위치 설정용 다른 그림`} /><button className="tap-layer" onPointerDown={addPoint} aria-label="정답 위치 추가">
        {editorPoints.map((point, index) => <span key={`${point.x}-${point.y}-${index}`} className="editor-ring" style={{ left: `${point.x}%`, top: `${point.y}%`, width: `${point.radius * 2}%`, aspectRatio: "1" }}>{index + 1}</span>)}
      </button></div>
      <div className="json-panel"><div className="json-heading"><strong>정답 좌표 {editorPoints.length}개</strong><div><button onClick={() => setEditorPoints((items) => items.slice(0, -1))} disabled={!editorPoints.length} aria-label="마지막 좌표 지우기"><PngIcon name="reset" /></button><button onClick={() => setEditorPoints([])} disabled={!editorPoints.length} aria-label="모든 좌표 지우기"><PngIcon name="trash" /></button></div></div><pre>{json}</pre><Button className="copy-button" onClick={copyJson}><PngIcon name="copy" /> {copied ? "복사했어요" : "JSON 복사"}</Button></div>
    </div>
  </DialogContent></Dialog>;
}
