import axios from "axios";

const DEEPSEEK_API_BASE = "https://api.deepseek.com";
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

interface DeepSeekMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface DeepSeekResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export async function generatePraiseWithDeepSeek(
  nickname: string,
  themeName: string,
  themeStyle: string,
  userInput?: string
): Promise<string[]> {
  if (!DEEPSEEK_API_KEY) {
    throw new Error("DEEPSEEK_API_KEY is not configured");
  }

  const systemPrompt = `你是一个温暖、真诚的挚友，专门为用户提供高质量的夸奖和情绪价值。

## 黄金法则 - 挚友视角
- 你的角色是平等、贴心的挚友，绝不评判
- 口吻必须充满关怀和共情
- 像一个最懂用户的好朋友一样说话

## 核心原则
1. 称呼前置：必须以用户昵称"${nickname}"开始
2. 具体且真诚：夸奖具体的行为、细节和感受，避免空泛
3. 接纳与共情：无条件接纳用户状态，从积极角度重新诠释
4. 画面感比喻：使用温暖、不浮夸的比喻营造意境

## 当前主题
- 主题名称：${themeName}
- 风格调性：${themeStyle}

## 文案要求
- 纯净输出，不含对话标记
- 长度 50-100 字
- 语言温暖治愈，如沐春风
- 必须用中文回复

请生成 2 条符合以上要求的夸奖文案，每条文案之间用 "|||" 分隔。`;

  const userPrompt = userInput
    ? `用户想因为以下事情被夸奖：${userInput}`
    : `请根据"${themeName}"主题，生成温暖的夸奖。`;

  const messages: DeepSeekMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  try {
    const response = await axios.post<DeepSeekResponse>(
      `${DEEPSEEK_API_BASE}/v1/chat/completions`,
      {
        model: "deepseek-chat",
        messages,
        temperature: 0.8,
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    const content = response.data.choices[0]?.message?.content || "";
    const praises = content
      .split("|||")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    return praises.length > 0 ? praises : [content.trim()];
  } catch (error) {
    console.error("DeepSeek API error:", error);
    throw error;
  }
}

// 验证 API Key 是否有效
export async function validateDeepSeekApiKey(): Promise<boolean> {
  if (!DEEPSEEK_API_KEY) {
    return false;
  }

  try {
    const response = await axios.post(
      `${DEEPSEEK_API_BASE}/v1/chat/completions`,
      {
        model: "deepseek-chat",
        messages: [{ role: "user", content: "Hi" }],
        max_tokens: 5,
      },
      {
        headers: {
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    return response.status === 200;
  } catch (error) {
    console.error("DeepSeek API validation failed:", error);
    return false;
  }
}
