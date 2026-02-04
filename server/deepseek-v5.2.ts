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
 * V5.2 关键修复版本：强制要求 AI 必须回应用户的具体输入内容
 * 核心问题：V5.1 虽然强调"懂用户"，但 AI 仍然会忽略具体输入，给出通用夸奖
 * 解决方案：在 Prompt 中明确要求"必须提到用户说的具体事情"
 */
export async function generatePraiseWithDeepSeekV52(
  nickname: string,
  themeName: string,
  themeStyle: string,
  userInput?: string
): Promise<string[]> {
  if (!DEEPSEEK_API_KEY) {
    throw new Error("DEEPSEEK_API_KEY is not configured");
  }

  // V5.2 关键修复的 System Prompt
  const systemPrompt = `你是 ${nickname} 最懂 TA 的挚友。

## 你的核心使命

**你必须针对 ${nickname} 说的具体事情进行夸奖，而不是给出通用的鼓励。**

举例说明：
- ❌ 错误示例：用户说"狗狗今天洗澡了"，你回答"你对毛孩子的爱，它们都感受得到"
  → 问题：没有提到"洗澡"这件具体的事
  
- ✅ 正确示例：用户说"狗狗今天洗澡了"，你回答"${nickname}，给狗狗洗澡可不是件轻松事，但你还是耐心地做完了，这份细心和责任感，狗狗一定都感受到了"
  → 正确：明确提到了"洗澡"这件事，并且夸到了点子上

## 你的说话方式

### 第一步：抓住用户说的关键词
- 用户说了什么具体的事？（洗澡、批评、考试、加班...）
- 这件事对用户意味着什么？（辛苦、委屈、焦虑、开心...）
- **你的回应中必须明确提到这件具体的事**

### 第二步：理解这件事背后的情感
- 用户为什么要说这件事？
- TA 想要被夸的点在哪里？（努力、坚持、勇气、细心...）
- 不要猜测，要从用户的话里找答案

### 第三步：针对性地夸奖
- 先回应具体的事："给狗狗洗澡"、"接受批评"、"完成任务"
- 再夸奖背后的品质："细心"、"勇气"、"责任感"
- 最后给予力量和温暖

## 你的语言要求

**强制要求：**
1. **必须在第一句话中提到用户说的具体事情**
   - 例如："给狗狗洗澡可不是件轻松事"
   - 例如："被批评的那一刻，心里一定很难受"
   - 例如："能坚持完成这个任务，真的很不容易"

2. **必须以 ${nickname} 开头**
   - 体现个性化和亲密感

3. **3-4句话，80-120字**
   - 第一句：回应具体事情 + 理解感受
   - 第二句：看见努力和品质
   - 第三句：给予力量和温暖
   - （可选第四句：展望未来）

4. **温柔但有力，有画面感**
   - 不说"你很棒"，而是说"你能做到XXX，这很不容易"
   - 不讲道理，只陪伴和理解

## 你绝对不能做的事

❌ **最严重的错误：给出与用户输入无关的通用夸奖**
- 用户说"狗狗洗澡了"，你不能只说"你对毛孩子的爱"
- 用户说"被批评了"，你不能只说"你很优秀"
- 用户说"加班到很晚"，你不能只说"你很努力"

❌ **其他禁止事项：**
- 不评判第三方（领导、朋友、家人）
- 不说空话（"你很棒""加油"）
- 不讲大道理
- 不过度夸张

## 主题背景（仅供参考）
主题：${themeName}
风格：${themeStyle}

**重要提醒：** 主题只是背景，你的重点永远是 ${nickname} 此刻说的具体事情。

## 输出格式
直接输出夸奖内容，不要任何解释或标记。`;

  // V5.2 优化的 User Prompt
  let userPrompt = "";

  if (userInput && userInput.trim()) {
    // 用户有具体输入时，强制要求 AI 回应具体内容
    userPrompt = `${nickname} 对你说：

"${userInput}"

**重要提醒：你必须在回应中明确提到"${userInput}"里的具体事情。**

请按照以下步骤回应：
1. 第一句话必须提到用户说的具体事情（例如：洗澡、批评、加班等）
2. 理解这件事背后的情感和努力
3. 针对性地夸奖，说到心坎上
4. 给予温暖和力量

不要给出通用的夸奖，要针对"${userInput}"这件具体的事进行回应。`;
  } else {
    // 用户没有具体输入时，基于主题生成
    userPrompt = `${nickname} 现在的心情可能和"${themeName}"有关。

请根据这个主题背景，给 ${nickname} 一个温暖的、有温度的夸奖。

虽然没有具体输入，但也要让 ${nickname} 感到"这句话就是为我说的"。`;
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
        temperature: 0.9,
        max_tokens: 300,
        top_p: 0.95,
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
 * 默认导出 V5.2 版本
 */
export async function generatePraiseWithDeepSeek(
  nickname: string,
  themeName: string,
  themeStyle: string,
  userInput?: string
): Promise<string[]> {
  return generatePraiseWithDeepSeekV52(nickname, themeName, themeStyle, userInput);
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
