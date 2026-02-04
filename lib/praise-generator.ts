import { Theme } from "./store";
import { generatePraiseApi } from "./api";
import { generateCustomizedFallbackV6 } from "./praise-generator-v6";
import { generatePraiseWithDeepSeek } from "./deepseek-client";
import { Platform } from "react-native";

// 预设的夸奖模板库，作为 API 失败时的后备方案
const PRAISE_TEMPLATES: Record<string, string[]> = {
  random: [
    "{name}，今天的你，也在认真生活呢。这份用心，值得被温柔以待。",
    "{name}，不管今天发生了什么，你都很棒。相信自己，你值得所有美好。",
    "{name}，能够在这里停下来，给自己一点温暖，本身就是一种了不起的自我关怀。",
  ],
  loneliness: [
    "{name}，独处的时光是你与自己深度对话的珍贵礼物。在这份宁静里，你正在慢慢发现一个更完整的自己。",
    "{name}，一个人的时候，你并不孤单，因为你拥有最忠实的陪伴——那就是你自己。",
    "{name}，能够享受独处的人，内心一定有着温柔的力量。你正在学会与自己和解。",
  ],
  happiness: [
    "{name}，你发现的这份小美好，就像阳光透过树叶洒下的光斑，温暖而治愈。",
    "{name}，能在平凡日子里捕捉到幸福的人，一定有一颗柔软细腻的心。",
    "{name}，这份小确幸被你记录下来，就变成了永恒的美好。",
  ],
  motivation: [
    "{name}，迈出第一步的你已经很棒了。不必着急，慢慢来，每一小步都是在靠近更好的自己。",
    "{name}，想要开始的念头本身就是一种力量。相信自己，你比想象中更有能力。",
    "{name}，拖延不是懒惰，只是在等待最好的时机。现在，这个时机来了。",
  ],
  study: [
    "{name}，每一个认真学习的时刻，都是在为未来的自己铺路。你的努力，时间都看得见。",
    "{name}，疲惫是因为你在用心付出。休息一下也没关系，你已经做得很好了。",
    "{name}，能够坚持学习的人，一定有着不凡的毅力。你的智慧终将带你去想去的地方。",
  ],
  work: [
    "{name}，职场上的你，专业又靠谱。每一份认真对待的工作，都在证明你的价值。",
    "{name}，工作中的挑战是成长的阶梯。你处理问题的方式，展现了你的专业素养。",
    "{name}，今天的付出，是明天成就的基石。你在职场上的每一步，都走得稳健而有力。",
  ],
  pregnancy: [
    "{name}，你正在孕育一个小小的奇迹，这是世界上最温柔、最伟大的事情。",
    "{name}，每一天，你都在用爱滋养着肚子里的小生命。你们的连接是最美的纽带。",
    "{name}，孕育生命的你，散发着母性的光芒。你是最美丽的准妈妈。",
  ],
  parenting: [
    "{name}，做父母没有标准答案，但你的爱就是最好的答案。孩子很幸运有你。",
    "{name}，育儿路上的每一份辛苦，都是爱的证明。你正在给孩子最好的陪伴。",
    "{name}，新手爸妈的焦虑很正常，但请相信，你做得比自己想象的要好得多。",
  ],
  pets: [
    "{name}，你对毛孩子的爱，它们都感受得到。能遇到你，是它们最大的幸运。",
    "{name}，照顾小生命需要耐心和爱心，而你两样都有。这是最温暖的羁绊。",
    "{name}，铲屎官的日常虽然琐碎，但每一个细节都是爱的表达。",
  ],
  traveler: [
    "{name}，在异乡打拼的你，有着让人敬佩的勇气和坚韧。家乡的风会轻轻拥抱你。",
    "{name}，想家的时候，记得你并不孤单。你的坚持正在创造更广阔的未来。",
    "{name}，异乡的星空下，你独自闪耀着光芒。这份独立是你送给自己最好的礼物。",
  ],
};

// 后备生成函数（当 API 不可用时使用）
function generateFallbackPraise(
  nickname: string,
  theme: Theme,
  input?: string
): string[] {
  // V5.3 优化：即使是后备方案，也尝试使用用户输入
  if (input && input.trim()) {
    // 提取关键词（简单版本）
    const keywords = extractKeywordsSimple(input);
    
    if (keywords.length > 0) {
      // 生成针对具体输入的夸奖
      return generateCustomizedFallback(nickname, input, keywords, theme);
    }
  }
  
  // 如果没有输入，使用通用模板
  const templates = PRAISE_TEMPLATES[theme.id] || PRAISE_TEMPLATES.random;
  const shuffled = [...templates].sort(() => Math.random() - 0.5);
  const selected = shuffled[0];
  return [selected.replace("{name}", nickname)];
}

// 简单的关键词提取（不依赖后端）
function extractKeywordsSimple(input: string): string[] {
  const keywords: string[] = [];
  const commonWords = ["洗澡", "批评", "考试", "加班", "学习", "工作", "狗狗", "猫咪", "领导", "朋友"];
  
  for (const word of commonWords) {
    if (input.includes(word)) {
      keywords.push(word);
    }
  }
  
  return keywords;
}

// 生成定制化的后备夸奖（V6.0 使用扩展模板库）
function generateCustomizedFallback(
  nickname: string,
  input: string,
  keywords: string[],
  theme: Theme
): string[] {
  // V6.0 使用扩展模板库
  const praise = generateCustomizedFallbackV6(nickname, input, keywords);
  return [praise];
}

// 检查是否在 Web 平台且有前端 API Key
function shouldUseDirectApiCall(): boolean {
  // 检查是否配置了前端 API Key
  const hasApiKey = !!process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY;
  console.log("[generatePraise] Check direct API call:", { platform: Platform.OS, hasApiKey });
  return hasApiKey;
}

// 主生成函数 - 智能选择调用方式
export async function generatePraise(
  nickname: string,
  theme: Theme,
  input?: string
): Promise<string[]> {
  console.log("[generatePraise] Called with:", { nickname, themeName: theme.name, input });
  
  // 策略：
  // 1. 如果有前端 API Key（Vercel 部署），直接调用 DeepSeek API
  // 2. 否则尝试调用后端 API（Manus/开发环境）
  // 3. 如果都失败，使用后备方案
  
  // 尝试方式 1：前端直接调用 DeepSeek API
  if (shouldUseDirectApiCall()) {
    try {
      console.log("[generatePraise] Using direct DeepSeek API call...");
      const result = await generatePraiseWithDeepSeek(
        nickname,
        theme.name,
        theme.style,
        input || undefined
      );
      
      if (result && result.length > 0) {
        console.log("[generatePraise] Direct API success:", result[0]);
        return [result[0]];
      }
    } catch (error) {
      console.error("[generatePraise] Direct API failed:", error);
      // 继续尝试后端 API
    }
  }
  
  // 尝试方式 2：调用后端 API
  try {
    console.log("[generatePraise] Calling backend API...");
    const result = await generatePraiseApi({
      nickname,
      themeName: theme.name,
      themeStyle: theme.style,
      userInput: input || undefined,
    });
    
    console.log("[generatePraise] Backend API result:", result);

    if (result.success && result.praises.length > 0) {
      console.log("[generatePraise] Backend API success:", result.praises[0]);
      return [result.praises[0]];
    }

    // API 返回失败，使用后备方案
    console.warn("[generatePraise] Backend API returned no praises, using fallback");
    return generateFallbackPraise(nickname, theme, input);
  } catch (error) {
    // API 调用失败，使用后备方案
    console.error("[generatePraise] Backend API failed:", error);
    if (error instanceof Error) {
      console.error("[generatePraise] Error details:", error.message);
    }
    return generateFallbackPraise(nickname, theme, input);
  }
}
