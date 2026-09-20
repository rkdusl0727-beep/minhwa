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
  differences: DifferencePoint[];
};

const fiveDifferences = (points: DifferencePoint[]): DifferencePoint[] => points.slice(0, 5);

export const minhwaList: Minhwa[] = [
  {
    id: "minhwa01",
    title: "수박과 들쥐",
    originalImage: "/minhwa/minhwa01-original.jpg",
    differenceImage: "/minhwa/minhwa01-difference-v4.webp",
    shortDescription: "커다란 수박 곁에서 들쥐 두 마리가 먹이를 찾고, 나비가 살랑살랑 날아다녀요.",
    description: "이 그림은 풀과 벌레를 함께 그린 초충도의 한 장이에요. 둥근 수박과 수박을 파먹는 들쥐, 날아다니는 나비를 자세히 그렸어요. 옛사람들은 수박의 많은 씨와 들쥐를 보며 먹을 것이 넉넉하고 가족이 건강하기를 바랐어요.",
    observationPoints: ["둥근 참외", "생쥐 두 마리", "나비", "가느다란 덩굴", "붉은 꽃"],
    differences: fiveDifferences([{x:60,y:19,radius:7},{x:89,y:31,radius:7},{x:21,y:49,radius:8},{x:58,y:77,radius:7},{x:76,y:89,radius:7}]),
  },
  {
    id: "minhwa02",
    title: "호작도",
    originalImage: "/minhwa/minhwa02-original.jpg",
    differenceImage: "/minhwa/minhwa02-difference-v4.webp",
    shortDescription: "소나무 가지의 까치와 커다란 호랑이가 함께 있는 익살스러운 그림이에요.",
    description: "호작도는 까치와 호랑이를 함께 그린 그림이에요. 옛사람들은 까치가 반가운 소식을 전하고, 호랑이가 나쁜 기운을 물리친다고 생각했어요. 무서운 호랑이인데도 둥근 눈과 커다란 발이 익살스럽게 보여요.",
    observationPoints: ["호랑이의 큰 눈", "검은 줄무늬", "까치", "소나무", "커다란 발"],
    differences: fiveDifferences([{x:64,y:39,radius:7},{x:40,y:68,radius:8},{x:77,y:80,radius:8},{x:42,y:20,radius:8},{x:24,y:15,radius:8}]),
  },
  {
    id: "minhwa03",
    title: "범과 모란",
    originalImage: "/minhwa/minhwa03-original.webp",
    differenceImage: "/minhwa/minhwa03-difference-v4.webp",
    shortDescription: "향기로운 모란을 바라보는 표범과 나비가 그려져 있어요.",
    description: "점무늬가 가득한 범이 커다란 모란꽃과 나비를 바라보고 있어요. 모란은 크고 화려해서 옛사람들이 풍요롭고 행복하게 살기를 바라는 마음으로 즐겨 그렸어요. 범의 수염과 꽃잎의 둥근 모양도 천천히 살펴보세요.",
    observationPoints: ["표범의 점무늬", "커다란 모란", "나비", "표범의 수염", "초록 잎"],
    differences: fiveDifferences([{x:69,y:32,radius:8},{x:31,y:20,radius:8},{x:25,y:66,radius:9},{x:87,y:11,radius:8},{x:53,y:42,radius:7}]),
  },
  {
    id: "minhwa04",
    title: "화조도",
    originalImage: "/minhwa/minhwa04-original.jpg",
    differenceImage: "/minhwa/minhwa04-difference-v4.webp",
    shortDescription: "꽃이 활짝 핀 나무에서 아름다운 새 두 마리가 쉬고 있어요.",
    description: "꽃과 새를 함께 그린 그림을 화조도라고 해요. 분홍 꽃이 핀 나무에서 새 두 마리가 쉬고 있어요. 옛사람들은 꽃과 새가 사이좋게 어울리는 모습을 보며 가족도 화목하고 행복하기를 바랐어요.",
    observationPoints: ["새 두 마리", "분홍 꽃", "긴 꼬리", "굽은 나무", "물결"],
    differences: fiveDifferences([{x:58,y:37,radius:8},{x:37,y:57,radius:8},{x:38,y:18,radius:8},{x:78,y:36,radius:8},{x:19,y:76,radius:8}]),
  },
  {
    id: "minhwa05",
    title: "초충도 - 가지와 방아깨비",
    originalImage: "/minhwa/minhwa05-original.jpg",
    differenceImage: "/minhwa/minhwa05-difference-v4.webp",
    shortDescription: "가지 열매와 풀 사이에 작은 벌레와 나비가 숨어 있어요.",
    description: "풀과 벌레를 자세히 그린 그림을 초충도라고 해요. 가지 열매와 나비, 방아깨비, 작은 벌레들이 화면 곳곳에 있어요. 아주 작은 생명도 소중하게 바라본 마음을 느끼며 하나씩 찾아보세요.",
    observationPoints: ["보라색 가지", "나비", "작은 벌레", "풀잎", "하얀 꽃"],
    differences: fiveDifferences([{x:54,y:58,radius:9},{x:84,y:35,radius:7},{x:40,y:20,radius:8},{x:67,y:75,radius:8},{x:28,y:70,radius:8}]),
  },
  {
    id: "minhwa06",
    title: "연화어해도",
    originalImage: "/minhwa/minhwa06-original.jpg",
    differenceImage: "/minhwa/minhwa06-difference-v4.webp",
    shortDescription: "연꽃 아래에서 물고기 두 마리가 힘차게 헤엄치고 있어요.",
    description: "연꽃과 물고기를 함께 그린 그림이에요. 넓은 연잎 아래에서 물고기 두 마리가 힘차게 물결을 올라요. 옛사람들은 깨끗하게 피는 연꽃과 힘찬 물고기를 보며 건강하고 넉넉하게 살기를 바랐어요.",
    observationPoints: ["연꽃 두 송이", "물고기 두 마리", "푸른 물결", "넓은 연잎", "물고기 수염"],
    differences: fiveDifferences([{x:30,y:59,radius:9},{x:68,y:64,radius:7},{x:78,y:18,radius:9},{x:49,y:38,radius:9},{x:16,y:74,radius:8}]),
  },
  {
    id: "minhwa07",
    title: "연화도",
    originalImage: "/minhwa/minhwa07-original.jpg",
    differenceImage: "/minhwa/minhwa07-difference-v4.webp",
    shortDescription: "연못에서 자란 연꽃과 연잎이 위로 길게 뻗어 있어요.",
    description: "연꽃을 그린 그림을 연화도라고 해요. 연꽃은 진흙물에서도 깨끗한 꽃을 피워서 맑고 바른 마음을 떠올리게 해요. 작은 꽃봉오리부터 활짝 핀 꽃까지 차례로 찾아보세요.",
    observationPoints: ["활짝 핀 연꽃", "작은 꽃봉오리", "커다란 연잎", "긴 줄기", "작은 동그란 잎"],
    differences: fiveDifferences([{x:38,y:52,radius:9},{x:42,y:31,radius:8},{x:36,y:14,radius:9},{x:53,y:78,radius:8},{x:30,y:84,radius:8}]),
  },
  {
    id: "minhwa08",
    title: "기명절지도",
    originalImage: "/minhwa/minhwa08-original.jpg",
    differenceImage: "/minhwa/minhwa08-difference-v4.webp",
    shortDescription: "매화가 꽂힌 항아리 안에서 물고기가 파도를 오르고 있어요.",
    description: "기명절지도는 꽃병과 책, 꽃과 여러 물건을 한데 모아 그린 그림이에요. 이 그림에는 푸른 항아리, 매화, 책, 물고기와 커다란 연꽃이 보여요. 옛사람들은 이런 물건에 오래 살고, 많이 배우고, 행복하기를 바라는 마음을 담았어요.",
    observationPoints: ["하얀 매화", "푸른 항아리", "파도를 오르는 물고기", "책", "분홍 연꽃"],
    differences: fiveDifferences([{x:46,y:44,radius:8},{x:56,y:78,radius:9},{x:30,y:16,radius:8},{x:78,y:70,radius:8},{x:53,y:63,radius:8}]),
  },
  {
    id: "minhwa09",
    title: "화조도 - 모란과 새",
    originalImage: "/minhwa/minhwa09-original.jpg",
    differenceImage: "/minhwa/minhwa09-difference-v4.webp",
    shortDescription: "붉은 모란 사이에 색색의 새 두 마리가 나란히 앉아 있어요.",
    description: "꽃과 새를 함께 그린 화조도예요. 크고 붉은 모란 사이에 새 두 마리가 나란히 앉아 있어요. 옛사람들은 화려한 모란을 보며 풍요를, 한 쌍의 새를 보며 사이좋게 지내는 가족을 떠올렸어요.",
    observationPoints: ["붉은 모란", "새 두 마리", "꽃봉오리", "초록 잎", "왼쪽 바위"],
    differences: fiveDifferences([{x:43,y:58,radius:8},{x:55,y:69,radius:8},{x:56,y:16,radius:9},{x:75,y:34,radius:9},{x:74,y:65,radius:8}]),
  },
  {
    id: "minhwa10",
    title: "어해도",
    originalImage: "/minhwa/minhwa10-original.jpg",
    differenceImage: "/minhwa/minhwa10-difference-v4.webp",
    shortDescription: "연꽃 연못 위로 새가 날고 커다란 물고기가 헤엄쳐요.",
    description: "물고기와 물속 생물을 그린 그림을 어해도라고 해요. 이 그림에는 연꽃 연못과 물가의 새, 하늘을 나는 제비, 크고 작은 물고기가 함께 있어요. 옛사람들은 힘차게 헤엄치는 물고기를 보며 먹을 것이 넉넉하고 일이 잘 풀리기를 바랐어요.",
    observationPoints: ["하늘의 제비", "연꽃봉오리", "물가의 새", "큰 물고기", "작은 물고기"],
    differences: fiveDifferences([{x:51,y:68,radius:9},{x:62,y:92,radius:9},{x:55,y:11,radius:9},{x:27,y:46,radius:8},{x:46,y:35,radius:8}]),
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
