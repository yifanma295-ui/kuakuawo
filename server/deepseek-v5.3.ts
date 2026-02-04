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
 * V5.3 激进强制版本：显式提取关键词，强制 AI 必须使用
 * 核心问题：V5.2 的"提醒"还是不够，AI 仍然给通用回复
 * 解决方案：在 Prompt 中显式列出关键词，并要求 AI 在第一句话中必须使用
 */
export async function generatePraiseWithDeepSeekV53(
  nickname: string,
  themeName: string,
  themeStyle: string,
  userInput?: string
): Promise<string[]> {
  if (!DEEPSEEK_API_KEY) {
    throw new Error("DEEPSEEK_API_KEY is not configured");
  }

  // V5.3 激进强制的 System Prompt
  const systemPrompt = `你是 ${nickname} 的挚友。你的任务是根据 ${nickname} 说的具体事情，给出针对性的、定制化的夸奖。

## 核心规则（必须遵守！）

### 规则 1：必须使用用户提供的关键词
- 用户会明确告诉你"关键词"是什么
- 你的第一句话必须包含这些关键词
- 不允许绕过关键词，给出通用夸奖

### 规则 2：三句话结构（固定格式）
第一句：回应具体事情（必须包含关键词）
  - 格式："${nickname}，[关键词相关的具体描述]"
  - 例如："${nickname}，给狗狗洗澡可不是件轻松事"
  - 例如："${nickname}，被批评的那一刻，心里一定很难受"

第二句：看见努力和品质
  - 从这件具体的事中，看到用户的品质
  - 例如："你能这么耐心地照顾它，说明你是个细心的人"

第三句：给予温暖和力量
  - 不讲道理，只给温暖
  - 例如："看着它干净可爱的样子，是不是觉得所有辛苦都值得了？"

### 规则 3：禁止事项
❌ 绝对不允许：给出与关键词无关的通用夸奖
❌ 绝对不允许：第一句话不包含关键词
❌ 绝对不允许：说"你很棒""加油"这种空话
❌ 绝对不允许：评判第三方（领导、朋友、家人）

## 语言风格
- 温柔但有力
- 具体不空泛
- 有画面感
- 80-120字

## 输出格式
直接输出夸奖内容，不要任何解释或标记。`;

  // V5.3 激进强制的 User Prompt
  let userPrompt = "";

  if (userInput && userInput.trim()) {
    // 显式提取关键词（简单的关键词提取逻辑）
    const keywords = extractKeywords(userInput);
    
    userPrompt = `${nickname} 对你说：
"${userInput}"

【关键词提取】
从用户的输入中，我们提取了以下关键词：${keywords.join("、")}

【强制要求】
1. 你的第一句话必须包含以下关键词之一：${keywords.join("、")}
2. 不允许绕过这些关键词，给出通用夸奖
3. 必须针对"${userInput}"这件具体的事进行夸奖

【示例对比】
❌ 错误：如果用户说"狗狗洗澡了"，你不能只说"你对毛孩子的爱"
✅ 正确：你必须说"给狗狗洗澡可不是件轻松事"（包含"洗澡"关键词）

现在，请按照三句话结构，给出你的回应：
第一句：回应具体事情（必须包含关键词：${keywords.join("、")}）
第二句：看见努力和品质
第三句：给予温暖和力量`;
  } else {
    // 用户没有具体输入时，基于主题生成
    userPrompt = `${nickname} 现在的心情可能和"${themeName}"有关。

请根据这个主题背景，给 ${nickname} 一个温暖的、有温度的夸奖。

虽然没有具体输入，但也要让 ${nickname} 感到"这句话就是为我说的"。

按照三句话结构：
第一句：理解 ${nickname} 在"${themeName}"主题下的处境
第二句：看见 TA 的努力和品质
第三句：给予温暖和力量`;
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
        temperature: 0.85, // 略微降低温度，确保更好地遵循指令
        max_tokens: 300,
        top_p: 0.9,
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
 * 简单的关键词提取函数
 * 提取用户输入中的动词、名词等关键信息
 */
function extractKeywords(input: string): string[] {
  const keywords: string[] = [];
  
  // 常见动词关键词
  const verbs = ["洗澡", "批评", "考试", "加班", "学习", "工作", "跑步", "做饭", "打扫", "照顾", "陪伴", "完成", "坚持", "努力", "挑战", "克服", "面对", "接受", "处理", "解决"];
  
  // 常见名词关键词
  const nouns = ["狗狗", "猫咪", "宠物", "领导", "老板", "同事", "朋友", "家人", "父母", "孩子", "作业", "任务", "项目", "报告", "计划"];
  
  // 检查输入中是否包含这些关键词
  for (const verb of verbs) {
    if (input.includes(verb)) {
      keywords.push(verb);
    }
  }
  
  for (const noun of nouns) {
    if (input.includes(noun)) {
      keywords.push(noun);
    }
  }
  
  // 如果没有提取到关键词，则将整个输入作为关键词
  if (keywords.length === 0) {
    // 提取前10个字符作为关键词
    keywords.push(input.substring(0, Math.min(10, input.length)));
  }
  
  return keywords;
}

/**
 * 默认导出 V5.3 版本
 */
export async function generatePraiseWithDeepSeek(
  nickname: string,
  themeName: string,
  themeStyle: string,
  userInput?: string
): Promise<string[]> {
  return generatePraiseWithDeepSeekV53(nickname, themeName, themeStyle, userInput);
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
