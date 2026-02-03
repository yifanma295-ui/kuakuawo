import AsyncStorage from "@react-native-async-storage/async-storage";

// 10 个核心主题定义（新增随机夸夸）
export interface Theme {
  id: string;
  name: string;
  emoji: string;
  description: string;
  style: string;
}

export const THEMES: Theme[] = [
  {
    id: "random",
    name: "随机夸夸",
    emoji: "🎲",
    description: "不知道选什么？让我来随机夸夸你",
    style: "综合各种风格，随机给予温暖的夸奖，适合任何心情。",
  },
  {
    id: "loneliness",
    name: "对抗孤独",
    emoji: "🌙",
    description: "感到孤单或独处时",
    style: "重新定义独处，将其描绘为与自己深度对话的宝贵时光。",
  },
  {
    id: "happiness",
    name: "记录生活小确幸",
    emoji: "✨",
    description: "发现生活中的微小美好时",
    style: "捕捉日常细节，放大平凡生活中的幸福感。",
  },
  {
    id: "motivation",
    name: "寻找动力",
    emoji: "🚀",
    description: "拖延或需要鼓励开始时",
    style: "温和地推动，肯定开始的勇气，不给压力。",
  },
  {
    id: "study",
    name: "学业冲刺",
    emoji: "📚",
    description: "备考、学习感到疲惫时",
    style: "肯定脑力劳动的付出，缓解压力，给予智力上的认可。",
  },
  {
    id: "work",
    name: "职场加油站",
    emoji: "💼",
    description: "工作挑战、顺利汇报或职场疲惫时",
    style: "专业且亲切，像并肩作战的同事，肯定专业价值。",
  },
  {
    id: "pregnancy",
    name: "孕期心情",
    emoji: "🌸",
    description: "孕妈妈记录身体变化或情绪时",
    style: "极度温柔，强调生命连接与孕育的伟大。",
  },
  {
    id: "parenting",
    name: "新手爸妈",
    emoji: "👶",
    description: "育儿过程中的辛苦与喜悦",
    style: "肯定爱与责任，缓解焦虑，赞美成长的点滴。",
  },
  {
    id: "pets",
    name: "铲屎官日常",
    emoji: "🐾",
    description: "与宠物互动、照顾宠物时",
    style: "温馨活泼，肯定用户对小生命的爱护。",
  },
  {
    id: "traveler",
    name: "异乡旅人",
    emoji: "🏠",
    description: "在异乡打拼感到想家或孤独时",
    style: "像家乡的微风，提供归属感，肯定独立奋斗的坚韧。",
  },
];

// 收藏的夸奖
export interface SavedPraise {
  id: string;
  content: string;
  themeId: string;
  createdAt: number;
  type: "self" | "others" | "highlight"; // 致自己 / 予他人 / 高光时刻
  input?: string; // 用户输入的事由
}

// 应用状态
export interface AppState {
  nickname: string;
  defaultThemeId: string;
  savedPraises: SavedPraise[];
  resonanceCount: number; // 共鸣数 (收藏的致自己类夸奖)
  echoCount: number; // 回响数 (分享或复制的予他人类夸奖)
  onboardingComplete: boolean; // 是否完成引导
}

const STORAGE_KEY = "kuakuawo_state";

const defaultState: AppState = {
  nickname: "朋友",
  defaultThemeId: "random", // 新用户默认随机夸夸
  savedPraises: [],
  resonanceCount: 0,
  echoCount: 0,
  onboardingComplete: false,
};

// 加载状态
export async function loadState(): Promise<AppState> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      return { ...defaultState, ...JSON.parse(data) };
    }
  } catch (error) {
    console.error("Failed to load state:", error);
  }
  return defaultState;
}

// 保存状态
export async function saveState(state: AppState): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save state:", error);
  }
}

// 获取动态问候语
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return "早安，今天也要开心哦！";
  } else if (hour >= 12 && hour < 14) {
    return "午安，记得好好吃饭哦！";
  } else if (hour >= 14 && hour < 18) {
    return "下午好，来杯奶茶吧！";
  } else if (hour >= 18 && hour < 22) {
    return "晚上好，辛苦了一天！";
  } else {
    return "夜深了，早点休息哦！";
  }
}

// 生成唯一 ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 获取随机主题（排除"随机夸夸"本身）
export function getRandomTheme(): Theme {
  const themesWithoutRandom = THEMES.filter((t) => t.id !== "random");
  const randomIndex = Math.floor(Math.random() * themesWithoutRandom.length);
  return themesWithoutRandom[randomIndex];
}
