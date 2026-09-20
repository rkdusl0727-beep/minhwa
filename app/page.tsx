"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, BookOpen, Check, CheckCircle2, Copy, Expand, Images, Lightbulb, RotateCcw, Settings, Trash2, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Difficulty, DifferencePoint, difficultyMeta, minhwaList, talkQuestions } from "@/src/data/minhwa";

type Screen = "home" | "select" | "intro" | "difficulty" | "game" | "learn";
type CompletionMap = Record<string, Difficulty[]>;
const STORAGE_KEY = "minhwa-detective-completions";

function loadCompletions(): CompletionMap {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
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
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [found, setFound] = useState<number[]>([]);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [hintIndex, setHintIndex] = useState<number | null>(null);
  const [gentleMessage, setGentleMessage] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [completed, setCompleted] = useState<CompletionMap>({});
  const [celebrate, setCelebrate] = useState(false);
  const [teacherOpen, setTeacherOpen] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const selected = minhwaList.find((item) => item.id === selectedId) || minhwaList[0];
  const points = selected.differences[difficulty];

  useEffect(() => setCompleted(loadCompletions()), []);

  const chooseArtwork = (id: string) => {
    setSelectedId(id); setScreen("intro"); window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const startGame = (level: Difficulty) => {
    setDifficulty(level); setFound([]); setHintsLeft(3); setHintIndex(null);
    setGentleMessage(false); setCelebrate(false); setScreen("game");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const markComplete = () => {
    const current = loadCompletions();
    const levels = new Set(current[selected.id] || []);
    levels.add(difficulty);
    const next = { ...current, [selected.id]: Array.from(levels) };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setCompleted(next); playTone(soundOn, "complete"); setCelebrate(true);
  };
  const handleArtTap = (event: React.PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const hit = points.findIndex((point, index) => {
      if (found.includes(index)) return false;
      return Math.hypot(x - point.x, y - point.y) <= point.radius;
    });
    if (hit >= 0) {
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
          <span className="brand-mark" aria-hidden="true">◉</span><span>민화 탐정</span>
        </button>
        <div className="top-actions">
          <button className="icon-control" onClick={() => setSoundOn((value) => !value)} aria-label={soundOn ? "효과음 끄기" : "효과음 켜기"}>{soundOn ? <Volume2 /> : <VolumeX />}</button>
          <button className="icon-control" onClick={() => document.documentElement.requestFullscreen?.()} aria-label="전체 화면으로 보기"><Expand /></button>
          <button className="icon-control teacher-button" onClick={() => setTeacherOpen(true)} aria-label="교사용 설정 열기"><Settings /></button>
        </div>
      </header>

      {screen === "home" && <section className="home-screen page-frame">
        <div className="home-copy">
          <span className="eyebrow">우리 그림 관찰 놀이</span>
          <h1>민화 속<br /><em>다른 곳</em>을 찾아라!</h1>
          <p>민화를 자세히 보고 다른 곳을 찾아보세요.</p>
          <Button className="primary-cta" onClick={() => setScreen("select")} aria-label="민화 놀이 시작하기">놀이 시작 <span aria-hidden="true">→</span></Button>
        </div>
        <div className="home-art" aria-label="민화 미리보기">
          <div className="art-window art-window-main"><img src={minhwaList[0].originalImage} alt="참외와 생쥐 민화" /></div>
          <div className="art-window art-window-small"><img src={minhwaList[2].originalImage} alt="표범과 모란 민화" /></div>
          <span className="look-ring ring-one" aria-hidden="true" /><span className="look-ring ring-two" aria-hidden="true" />
        </div>
      </section>}

      {screen === "select" && <section className="page-frame selection-screen">
        <div className="section-heading"><div><span className="eyebrow">어떤 그림을 살펴볼까요?</span><h1>민화를 골라 주세요</h1></div><p>그림을 누르면 먼저 천천히 관찰할 수 있어요.</p></div>
        <div className="art-grid">
          {minhwaList.map((item, index) => {
            const done = (completed[item.id] || []).length > 0;
            return <button key={item.id} className="art-card" onClick={() => chooseArtwork(item.id)} aria-label={`${item.title} 살펴보기${done ? ", 완료함" : ""}`}>
              <span className="card-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="card-image"><img src={item.originalImage} alt={`${item.title} 민화`} /></span>
              <span className="card-footer"><strong>{item.title}</strong>{done && <span className="done-badge"><Check /> 찾아봤어요</span>}</span>
            </button>;
          })}
        </div>
      </section>}

      {screen === "intro" && <section className="page-frame observation-screen">
        <BackButton label="민화 고르기" onClick={() => setScreen("select")} />
        <div className="observation-layout">
          <div className="intro-image"><img src={selected.originalImage} alt={`${selected.title} 원본 민화`} /></div>
          <div className="intro-copy"><span className="eyebrow">먼저 그림을 천천히 봐요</span><h1>{selected.title}</h1><p>{selected.shortDescription}</p>
            <div className="look-question"><span aria-hidden="true">👀</span><strong>그림 속에서 무엇이 보이나요?</strong></div>
            <Button className="primary-cta wide" onClick={() => setScreen("difficulty")} aria-label="난이도를 고르고 다른 곳 찾기 시작">다른 곳 찾으러 가기 <span aria-hidden="true">→</span></Button>
          </div>
        </div>
      </section>}

      {screen === "difficulty" && <section className="page-frame difficulty-screen">
        <BackButton label="그림 다시 보기" onClick={() => setScreen("intro")} />
        <div className="center-heading"><span className="eyebrow">{selected.title}</span><h1>몇 개를 찾아볼까요?</h1><p>하고 싶은 난이도를 직접 골라 보세요.</p></div>
        <div className="difficulty-grid">{(Object.keys(difficultyMeta) as Difficulty[]).map((level) => {
          const meta = difficultyMeta[level];
          return <button key={level} className={`difficulty-card ${level}`} onClick={() => startGame(level)} aria-label={`${meta.label}, 다른 곳 ${meta.count}개`}>
            <span className="difficulty-emoji" aria-hidden="true">{meta.emoji}</span><strong>{meta.label}</strong><span>{meta.note}</span><span className="choose-label">이걸로 할래요 →</span>
          </button>;
        })}</div>
      </section>}

      {screen === "game" && <section className="game-screen page-frame wide-frame">
        <div className="game-heading">
          <BackButton label="난이도 바꾸기" onClick={() => setScreen("difficulty")} />
          <div><span className="eyebrow">{difficultyMeta[difficulty].emoji} {difficultyMeta[difficulty].label}</span><h1>{selected.title}</h1><p>다른 그림에서 달라진 곳을 찾아보세요!</p></div>
          <div className="progress-pill" aria-live="polite"><span>찾은 곳</span><strong>{found.length} / {points.length}</strong></div>
        </div>
        <div className="progress-track" aria-hidden="true"><span style={{ width: `${(found.length / points.length) * 100}%` }} /></div>
        <div className="game-grid">
          <ArtworkPanel label="원래 그림" image={selected.originalImage} alt={`${selected.title} 원래 그림`} />
          <ArtworkPanel label="다른 그림 · 여기를 눌러요" image={selected.differenceImage} alt={`${selected.title} 다른 그림`} interactive onTap={handleArtTap} points={points} found={found} hintIndex={hintIndex} shake={gentleMessage} />
        </div>
        <div className="game-controls">
          <Button variant="outline" className="large-control" onClick={showHint} disabled={hintsLeft === 0 || found.length === points.length} aria-label={`힌트 보기, ${hintsLeft}개 남음`}><Lightbulb /> 힌트 <span className="control-count">{hintsLeft}</span></Button>
          <p className={`gentle-message ${gentleMessage ? "show" : ""}`} aria-live="polite">물결처럼 천천히, 조금 더 자세히 살펴볼까요?</p>
          <Button variant="outline" className="large-control" onClick={() => startGame(difficulty)} aria-label="같은 그림 다시 시작"><RotateCcw /> 다시 하기</Button>
        </div>
      </section>}

      {screen === "learn" && <section className="page-frame learn-screen">
        <BackButton label="민화 고르기" onClick={() => setScreen("select")} />
        <div className="learn-heading"><span className="eyebrow">민화 더 알아보기</span><h1>이 민화를 다시 살펴볼까요?</h1></div>
        <div className="learn-layout">
          <div className="learn-image"><img src={selected.originalImage} alt={`${selected.title} 민화 다시 보기`} /></div>
          <div className="learn-copy"><h2>{selected.title}</h2>
            <div className="observation-list"><h3>그림 속에서 찾아보세요</h3><ul>{selected.observationPoints.map((point) => <li key={point}><CheckCircle2 /> {point}</li>)}</ul></div>
            <div className="story-box"><h3>이 그림에는 어떤 이야기가 있을까요?</h3><p>{selected.description}</p></div>
            <div className="talk-card"><span>함께 이야기해요</span><strong>{talkQuestions[questionIndex]}</strong></div>
            <div className="learn-actions"><Button className="primary-cta" onClick={() => setScreen("select")}><Images /> 다른 민화 찾기</Button><Button variant="outline" className="large-control" onClick={() => startGame(difficulty)}><RotateCcw /> 다시 하기</Button></div>
          </div>
        </div>
      </section>}

      <Dialog open={celebrate} onOpenChange={setCelebrate}><DialogContent className="celebration-dialog" showCloseButton={false}>
        <div className="celebration-stars" aria-hidden="true"><span>✦</span><span>✧</span><span>✦</span></div>
        <DialogHeader className="items-center text-center"><DialogTitle>민화 탐정 성공!</DialogTitle><DialogDescription>다른 곳을 모두 찾았어요!</DialogDescription></DialogHeader>
        <div className="celebration-actions"><Button className="primary-cta" onClick={goLearn}><BookOpen /> 민화 더 알아보기</Button><Button variant="outline" className="large-control" onClick={() => { setCelebrate(false); setScreen("select"); }}><Images /> 다른 민화 찾기</Button><Button variant="ghost" className="large-control" onClick={() => startGame(difficulty)}><RotateCcw /> 다시 하기</Button></div>
      </DialogContent></Dialog>
      <TeacherEditor open={teacherOpen} onOpenChange={setTeacherOpen} />
    </main>
  );
}

function BackButton({ label, onClick }: { label: string; onClick: () => void }) {
  return <button className="back-button" onClick={onClick}><ArrowLeft /> {label}</button>;
}

function ArtworkPanel({ label, image, alt, interactive = false, onTap, points = [], found = [], hintIndex = null, shake = false }: {
  label: string; image: string; alt: string; interactive?: boolean; onTap?: (event: React.PointerEvent<HTMLButtonElement>) => void;
  points?: DifferencePoint[]; found?: number[]; hintIndex?: number | null; shake?: boolean;
}) {
  return <figure className="art-panel"><figcaption>{label}</figcaption><div className={`game-art ${shake ? "soft-shake" : ""}`}>
    <img src={image} alt={alt} draggable={false} />
    {interactive && <button className="tap-layer" onPointerDown={onTap} aria-label="다른 곳 찾기 그림, 달라 보이는 부분을 눌러 주세요">
      {points.map((point, index) => found.includes(index)
        ? <span key={index} className="found-ring" style={{ left: `${point.x}%`, top: `${point.y}%`, width: `${point.radius * 2}%`, aspectRatio: "1" }}><span>✦</span></span>
        : hintIndex === index ? <span key={index} className="hint-glow" style={{ left: `${point.x}%`, top: `${point.y}%`, width: `${point.radius * 2.5}%`, aspectRatio: "1" }} /> : null)}
    </button>}
  </div></figure>;
}

function TeacherEditor({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [artworkId, setArtworkId] = useState(minhwaList[0].id);
  const [level, setLevel] = useState<Difficulty>("easy");
  const [radius, setRadius] = useState(6);
  const selected = useMemo(() => minhwaList.find((item) => item.id === artworkId) || minhwaList[0], [artworkId]);
  const [editorPoints, setEditorPoints] = useState<DifferencePoint[]>(selected.differences[level]);
  const [copied, setCopied] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  useEffect(() => setEditorPoints(selected.differences[level]), [selected, level]);
  const addPoint = (event: React.PointerEvent<HTMLButtonElement>) => {
    const image = imageRef.current; if (!image) return;
    const rect = image.getBoundingClientRect();
    setEditorPoints((items) => [...items, { x: Number((((event.clientX - rect.left) / rect.width) * 100).toFixed(1)), y: Number((((event.clientY - rect.top) / rect.height) * 100).toFixed(1)), radius }]);
  };
  const json = JSON.stringify(editorPoints, null, 2);
  const copyJson = async () => {
    await navigator.clipboard.writeText(json); setCopied(true); window.setTimeout(() => setCopied(false), 1400);
  };
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="teacher-dialog">
    <DialogHeader><DialogTitle>교사용 정답 위치 설정</DialogTitle><DialogDescription>다른 그림을 눌러 좌표를 만들고, JSON을 복사해 데이터 파일에 붙여 넣으세요.</DialogDescription></DialogHeader>
    <div className="teacher-toolbar">
      <label>민화<Select value={artworkId} onValueChange={setArtworkId}><SelectTrigger className="teacher-select"><SelectValue /></SelectTrigger><SelectContent>{minhwaList.map((item) => <SelectItem key={item.id} value={item.id}>{item.title}</SelectItem>)}</SelectContent></Select></label>
      <label>난이도<Select value={level} onValueChange={(value) => setLevel(value as Difficulty)}><SelectTrigger className="teacher-select"><SelectValue /></SelectTrigger><SelectContent>{(Object.keys(difficultyMeta) as Difficulty[]).map((item) => <SelectItem key={item} value={item}>{difficultyMeta[item].label}</SelectItem>)}</SelectContent></Select></label>
      <label className="radius-control">영역 크기 <strong>{radius}%</strong><Slider value={[radius]} min={3} max={12} step={1} onValueChange={(value) => setRadius(value[0])} aria-label="정답 영역 크기" /></label>
    </div>
    <div className="teacher-grid">
      <div className="teacher-image"><img ref={imageRef} src={selected.differenceImage} alt={`${selected.title} 정답 위치 설정용 다른 그림`} /><button className="tap-layer" onPointerDown={addPoint} aria-label="정답 위치 추가">
        {editorPoints.map((point, index) => <span key={`${point.x}-${point.y}-${index}`} className="editor-ring" style={{ left: `${point.x}%`, top: `${point.y}%`, width: `${point.radius * 2}%`, aspectRatio: "1" }}>{index + 1}</span>)}
      </button></div>
      <div className="json-panel"><div className="json-heading"><strong>정답 좌표 {editorPoints.length}개</strong><div><button onClick={() => setEditorPoints((items) => items.slice(0, -1))} disabled={!editorPoints.length} aria-label="마지막 좌표 지우기"><RotateCcw /></button><button onClick={() => setEditorPoints([])} disabled={!editorPoints.length} aria-label="모든 좌표 지우기"><Trash2 /></button></div></div><pre>{json}</pre><Button className="copy-button" onClick={copyJson}><Copy /> {copied ? "복사했어요" : "JSON 복사"}</Button></div>
    </div>
  </DialogContent></Dialog>;
}
