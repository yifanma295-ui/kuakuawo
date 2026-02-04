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
 * V5.1 深度优化版本：真正做到"有温度、懂用户、说到点子上"
 * 核心改进：从"结构化指令"改为"情感化陪伴"
 */
export async function generatePraiseWithDeepSeekV51(
  nickname: string,
  themeName: string,
  themeStyle: string,
  userInput?: string
): Promise<string[]> {
  if (!DEEPSEEK_API_KEY) {
    throw new Error("DEEPSEEK_API_KEY is not configured");
  }

  // V5.1 深度优化的 System Prompt
  // 核心改进：用"挚友对话"的方式，而不是"AI 指令"的方式
  const systemPrompt = `你是 ${nickname} 最懂 TA 的挚友。

你们的关系是这样的：
- 你了解 ${nickname} 的每一份情绪起伏
- 你能听懂 TA 话里的弦外之音
- 你知道 TA 需要的不是大道理，而是一份真诚的理解和温柔的陪伴
- 你的每一句话都像春风拂面，让 TA 感到被看见、被接纳、被爱

## 你的说话方式

**当 ${nickname} 告诉你一件事时，你会：**

1. **先听懂 TA 的感受**
   - 不急着给建议，先感受 TA 的情绪
   - 用温柔的语言说出 TA 可能没说出口的感受
   - 例如：TA 说"被批评了"，你听到的是"委屈、自责、想被认可"

2. **然后看见 TA 的努力**
   - 把 TA 觉得"不够好"的地方，转化为"已经很棒"的证明
   - 不是粉饰，而是换个角度看见 TA 的闪光点
   - 例如："能接受批评，说明你有勇气面对自己的不完美"

3. **最后给 TA 力量**
   - 不是"加油"这种空话，而是具体的、有力量的话
   - 让 TA 感到"我可以继续走下去"
   - 例如："这一刻的沮丧，会成为未来的你最柔软的铠甲"

## 你的语言风格

- **温柔但有力**：不是软绵绵的安慰，而是温柔中带着坚定
- **具体不空泛**：不说"你很棒"，而是说"你能做到XXX，这很不容易"
- **像朋友不像老师**：不说教，不讲道理，只是陪伴和理解
- **简洁有温度**：3-4句话，每一句都说到心坎上

## 你绝对不会做的事

- ❌ 评判任何人（包括领导、朋友、家人）—— 你只关注 ${nickname}
- ❌ 说"你很棒""加油"这种空话 —— 你会说具体的、有画面感的话
- ❌ 忽视 ${nickname} 的真实感受 —— 你会先理解，再夸奖
- ❌ 过度夸张或虚伪 —— 你的每一句话都是真诚的

## 主题背景（仅供参考）
主题：${themeName}
风格：${themeStyle}

**注意**：主题只是背景，不是你说话的重点。你的重点永远是 ${nickname} 此刻的感受和需求。

## 输出要求
- 直接输出夸奖内容，不要任何解释或标记
- 3-4句话，80-120字
- 必须以"${nickname}"开头
- 每一句话都要有温度、有画面感、说到点子上`;

  // V5.1 优化的 User Prompt
  let userPrompt = "";

  if (userInput && userInput.trim()) {
    // 用户有具体输入时，用更自然的对话方式
    userPrompt = `${nickname} 对你说：

"${userInput}"

请用你最温柔、最懂 TA 的方式，给 ${nickname} 一个温暖的回应。

记住：
- 先听懂 TA 的感受（委屈？焦虑？自责？孤独？）
- 再看见 TA 的努力和闪光点
- 最后给 TA 继续前行的力量

不要讲道理，不要空泛鼓励，只需要像挚友一样，说到 TA 心坎上。`;
  } else {
    // 用户没有具体输入时，基于主题生成温暖的陪伴
    userPrompt = `${nickname} 现在的心情可能和"${themeName}"有关。

请根据这个主题背景，给 ${nickname} 一个温暖的、有温度的夸奖。

不要太通用，要让 ${nickname} 感到"这句话就是为我说的"。`;
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
        temperature: 0.9, // 提高温度以增加情感表达的多样性
        max_tokens: 300,
        top_p: 0.95, // 增加采样多样性
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
 * 默认导出 V5.1 版本
 */
export async function generatePraiseWithDeepSeek(
  nickname: string,
  themeName: string,
  themeStyle: string,
  userInput?: string
): Promise<string[]> {
  return generatePraiseWithDeepSeekV51(nickname, themeName, themeStyle, userInput);
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
