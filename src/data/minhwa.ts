export type Difficulty = "easy" | "normal" | "hard";

export type DifferencePoint = {
  x: number;
  y: number;
  radius: number;
};

export type Minhwa = {
  id: string;
  title: string;
  originalImage: string;
  differenceImage: string;
  shortDescription: string;
  description: string;
  observationPoints: string[];
  differences: Record<Difficulty, DifferencePoint[]>;
};

const levels = (points: DifferencePoint[]): Record<Difficulty, DifferencePoint[]> => ({
  easy: points.slice(0, 3),
  normal: points.slice(0, 5),
  hard: points.slice(0, 7),
});

export const minhwaList: Minhwa[] = [
  {
    id: "minhwa01",
    title: "참외와 생쥐",
    originalImage: "/minhwa/minhwa01-original.jpg",
    differenceImage: "/minhwa/minhwa01-difference.png",
    shortDescription: "커다란 참외 곁에 생쥐와 나비, 꽃이 모여 있는 그림이에요.",
    description: "작은 생명들이 참외밭에 모였어요. 둥근 참외의 무늬와 덩굴의 모양, 나비의 날개를 천천히 살펴보세요.",
    observationPoints: ["둥근 참외", "생쥐 두 마리", "나비", "가느다란 덩굴", "붉은 꽃"],
    differences: levels([{x:48,y:77,radius:7},{x:76,y:88,radius:7},{x:60,y:19,radius:7},{x:18,y:68,radius:6},{x:87,y:34,radius:6},{x:52,y:35,radius:6},{x:29,y:20,radius:6}]),
  },
  {
    id: "minhwa02",
    title: "호랑이와 토끼",
    originalImage: "/minhwa/minhwa02-original.jpg",
    differenceImage: "/minhwa/minhwa02-difference.png",
    shortDescription: "커다란 호랑이 뒤로 토끼와 소나무가 보이는 익살스러운 그림이에요.",
    description: "민화 속 호랑이는 무섭기보다 재미있고 친근한 표정을 짓기도 해요. 굵은 줄무늬와 동그란 눈, 토끼의 모습을 찾아보세요.",
    observationPoints: ["호랑이의 큰 눈", "검은 줄무늬", "토끼", "소나무", "커다란 발"],
    differences: levels([{x:76,y:39,radius:6},{x:43,y:69,radius:7},{x:77,y:80,radius:7},{x:55,y:22,radius:6},{x:30,y:24,radius:6},{x:81,y:27,radius:6},{x:20,y:52,radius:6}]),
  },
  {
    id: "minhwa03",
    title: "표범과 모란",
    originalImage: "/minhwa/minhwa03-original.webp",
    differenceImage: "/minhwa/minhwa03-difference.png",
    shortDescription: "향기로운 모란을 바라보는 표범과 나비가 그려져 있어요.",
    description: "표범의 얼굴에는 둥근 점무늬가 가득해요. 부드러운 모란 꽃잎과 알록달록한 나비도 함께 비교해 보세요.",
    observationPoints: ["표범의 점무늬", "커다란 모란", "나비", "표범의 수염", "초록 잎"],
    differences: levels([{x:69,y:34,radius:8},{x:31,y:21,radius:7},{x:27,y:67,radius:8},{x:89,y:12,radius:7},{x:50,y:55,radius:6},{x:44,y:88,radius:7},{x:82,y:48,radius:6}]),
  },
  {
    id: "minhwa04",
    title: "꽃나무와 새",
    originalImage: "/minhwa/minhwa04-original.jpg",
    differenceImage: "/minhwa/minhwa04-difference.png",
    shortDescription: "꽃이 활짝 핀 나무에서 아름다운 새 두 마리가 쉬고 있어요.",
    description: "분홍 꽃과 초록빛 새가 서로 잘 어울려요. 새의 깃털 색과 길게 뻗은 꼬리, 나뭇가지의 곡선을 살펴보세요.",
    observationPoints: ["새 두 마리", "분홍 꽃", "긴 꼬리", "굽은 나무", "물결"],
    differences: levels([{x:58,y:37,radius:7},{x:38,y:57,radius:7},{x:37,y:23,radius:6},{x:78,y:35,radius:6},{x:23,y:74,radius:7},{x:63,y:90,radius:7},{x:69,y:61,radius:6}]),
  },
  {
    id: "minhwa05",
    title: "가지와 풀벌레",
    originalImage: "/minhwa/minhwa05-original.jpg",
    differenceImage: "/minhwa/minhwa05-difference.png",
    shortDescription: "가지 열매와 풀 사이에 작은 벌레와 나비가 숨어 있어요.",
    description: "작은 풀벌레를 자세히 그린 그림을 초충도라고 불러요. 열매와 잎 사이를 천천히 보며 작은 생명을 찾아보세요.",
    observationPoints: ["보라색 가지", "나비", "작은 벌레", "풀잎", "하얀 꽃"],
    differences: levels([{x:54,y:51,radius:8},{x:75,y:25,radius:7},{x:42,y:18,radius:7},{x:66,y:64,radius:6},{x:27,y:55,radius:6},{x:79,y:72,radius:6},{x:49,y:84,radius:6}]),
  },
  {
    id: "minhwa06",
    title: "연꽃과 물고기",
    originalImage: "/minhwa/minhwa06-original.jpg",
    differenceImage: "/minhwa/minhwa06-difference.png",
    shortDescription: "연꽃 아래에서 물고기 두 마리가 힘차게 헤엄치고 있어요.",
    description: "연꽃은 맑고 깨끗한 마음을 떠올리게 해요. 물결 사이로 솟아오른 물고기의 비늘과 지느러미를 살펴보세요.",
    observationPoints: ["연꽃 두 송이", "물고기 두 마리", "푸른 물결", "넓은 연잎", "물고기 수염"],
    differences: levels([{x:28,y:70,radius:8},{x:67,y:73,radius:8},{x:77,y:21,radius:7},{x:39,y:34,radius:7},{x:18,y:85,radius:6},{x:57,y:63,radius:6},{x:87,y:94,radius:6}]),
  },
  {
    id: "minhwa07",
    title: "연꽃 한 포기",
    originalImage: "/minhwa/minhwa07-original.jpg",
    differenceImage: "/minhwa/minhwa07-difference.png",
    shortDescription: "연못에서 자란 연꽃과 연잎이 위로 길게 뻗어 있어요.",
    description: "같은 연꽃이어도 피어난 모습이 모두 달라요. 꽃봉오리부터 활짝 핀 꽃까지 차례로 찾아보세요.",
    observationPoints: ["활짝 핀 연꽃", "작은 꽃봉오리", "커다란 연잎", "긴 줄기", "작은 동그란 잎"],
    differences: levels([{x:43,y:50,radius:8},{x:47,y:30,radius:7},{x:37,y:15,radius:8},{x:44,y:75,radius:7},{x:26,y:88,radius:6},{x:18,y:82,radius:6},{x:59,y:66,radius:6}]),
  },
  {
    id: "minhwa08",
    title: "매화와 물고기 항아리",
    originalImage: "/minhwa/minhwa08-original.jpg",
    differenceImage: "/minhwa/minhwa08-difference.png",
    shortDescription: "매화가 꽂힌 항아리 안에서 물고기가 파도를 오르고 있어요.",
    description: "한 그림 안에 꽃, 항아리, 물고기와 책이 함께 있어요. 겹겹이 놓인 모양을 아래에서 위로 살펴보세요.",
    observationPoints: ["하얀 매화", "푸른 항아리", "파도를 오르는 물고기", "책", "분홍 연꽃"],
    differences: levels([{x:52,y:46,radius:8},{x:47,y:72,radius:8},{x:30,y:16,radius:7},{x:68,y:29,radius:6},{x:51,y:58,radius:6},{x:74,y:88,radius:7},{x:18,y:78,radius:7}]),
  },
  {
    id: "minhwa09",
    title: "모란과 새",
    originalImage: "/minhwa/minhwa09-original.jpg",
    differenceImage: "/minhwa/minhwa09-difference.png",
    shortDescription: "붉은 모란 사이에 색색의 새 두 마리가 나란히 앉아 있어요.",
    description: "모란은 크고 화려해서 꽃 중의 왕이라고도 불렸어요. 붉은 꽃송이와 새의 알록달록한 깃털을 살펴보세요.",
    observationPoints: ["붉은 모란", "새 두 마리", "꽃봉오리", "초록 잎", "왼쪽 바위"],
    differences: levels([{x:47,y:55,radius:8},{x:61,y:56,radius:8},{x:42,y:27,radius:8},{x:68,y:31,radius:7},{x:77,y:77,radius:7},{x:51,y:88,radius:7},{x:20,y:52,radius:7}]),
  },
  {
    id: "minhwa10",
    title: "연꽃 연못의 물고기",
    originalImage: "/minhwa/minhwa10-original.jpg",
    differenceImage: "/minhwa/minhwa10-difference.png",
    shortDescription: "연꽃 연못 위로 새가 날고 커다란 물고기가 헤엄쳐요.",
    description: "하늘의 제비부터 연못의 물고기까지 세로로 긴 그림 속에 이야기가 이어져요. 위에서 아래로 천천히 살펴보세요.",
    observationPoints: ["하늘의 제비", "연꽃봉오리", "물가의 새", "큰 물고기", "작은 물고기"],
    differences: levels([{x:49,y:66,radius:8},{x:55,y:88,radius:8},{x:55,y:8,radius:7},{x:37,y:43,radius:7},{x:70,y:36,radius:6},{x:25,y:27,radius:6},{x:80,y:73,radius:6}]),
  },
];

export const talkQuestions = [
  "그림에서 가장 먼저 눈에 들어온 것은 무엇인가요?",
  "어떤 색이 가장 많이 보이나요?",
  "그림 속 동물은 무엇을 하고 있나요?",
  "내가 그림 속에 들어간다면 어디에 있고 싶나요?",
  "친구에게 이 그림을 소개한다면 뭐라고 말하고 싶나요?",
  "처음 그림과 다른 그림에서 무엇이 달라졌나요?",
];

export const difficultyMeta = {
  easy: { label: "쉬움", emoji: "🌱", count: 3, note: "눈에 띄는 다른 곳 3개" },
  normal: { label: "보통", emoji: "🌼", count: 5, note: "조금 더 살펴볼 곳 5개" },
  hard: { label: "어려움", emoji: "🔥", count: 7, note: "꼼꼼히 찾을 곳 7개" },
} satisfies Record<Difficulty, { label: string; emoji: string; count: number; note: string }>;
