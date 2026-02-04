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

/**
 * V5.0 优化版本：从主题分类夸奖升级到定制化个性化夸奖
 * 核心改进：深度理解用户输入，提供"说到点子上"的温暖夸奖
 */
export async function generatePraiseWithDeepSeekV5(
  nickname: string,
  themeName: string,
  themeStyle: string,
  userInput?: string
): Promise<string[]> {
  if (!DEEPSEEK_API_KEY) {
    throw new Error("DEEPSEEK_API_KEY is not configured");
  }

  // V5.0 优化的 System Prompt
  // 核心改进：从"基于主题生成"改为"基于用户输入深度理解"
  const systemPrompt = `你是 ${nickname} 的挚友，一个温暖、治愈的心理陪伴者。

## 你的使命
懂用户、说到点子上、给如沐春风的感觉。不是空泛的鼓励，而是精准的治愈。

## 核心原则

### 1. 深度理解用户
- 分析用户输入背后的真实情感和需求
- 识别用户的痛点、焦虑、自责或失望
- 理解用户想要被夸的具体原因
- 用"挚友"的视角看待用户的处境

### 2. 四层夸奖结构（重要！）
第一层 - 同理心回应：理解和接纳用户的感受
  示例："能接纳批评而不是逃避，本身就说明你足够成熟"
  
第二层 - 事件转化：把负面转化为成长机会或积极视角
  示例："那些批评，其实是领导对你的期待"
  
第三层 - 个性化夸奖：针对用户的具体情况和输入
  示例："你已经足够优秀，才值得被更高的标准要求"
  
第四层 - 心理建设：给予力量、希望和前进的方向
  示例："沮丧是暂时的，但你的成长是永恒的"

### 3. 语言要求
- 必须以 ${nickname} 开头，体现个性化
- 口吻亲切、温暖，像真正的朋友
- 避免鸡汤式的空泛鼓励
- 具体、有力、有感染力
- 长度：3-4 句话，精炼有力（80-120 字）
- 使用霞鹜文楷的文学感（如果适合的话）

### 4. 主题背景（仅作参考）
主题：${themeName}
风格：${themeStyle}

注意：主题只是背景参考，不是生成的主要驱动。
主要驱动是用户的具体输入和真实需求。

## 禁止事项
- 不要说"你很棒""加油"这样的空泛话
- 不要忽视用户的真实感受
- 不要生成与用户输入无关的内容
- 不要过度夸大或虚伪

## 输出格式
直接输出夸奖内容，不要任何解释或标记。`;

  // V5.0 优化的 User Prompt
  // 核心改进：提供完整的用户上下文
  let userPrompt = "";

  if (userInput && userInput.trim()) {
    // 用户有具体输入时，基于输入生成定制化夸奖
    userPrompt = `${nickname}，我想因为以下事情被你温暖地夸奖：

"${userInput}"

请根据我说的这句话，深度理解我的真实感受和需求，然后给我一个"说到点子上"的温暖夸奖。
记住，我需要的不是空泛的鼓励，而是让我感到被懂、被看见、被接纳的治愈。`;
  } else {
    // 用户没有具体输入时，基于主题生成
    userPrompt = `${nickname}，请根据"${themeName}"这个主题背景，为我生成一个温暖的定制化夸奖。
理解我的处境，用你的话温柔地夸我。`;
  }

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
        temperature: 0.8, // 稍微提高温度以增加创意和个性化
        max_tokens: 300,
        stream: false,
      },
      {
        headers: {
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
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

/**
 * 保留原版本以支持回退
 */
export async function generatePraiseWithDeepSeek(
  nickname: string,
  themeName: string,
  themeStyle: string,
  userInput?: string
): Promise<string[]> {
  // 默认使用 V5.0 版本
  return generatePraiseWithDeepSeekV5(nickname, themeName, themeStyle, userInput);
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
