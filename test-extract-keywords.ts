// 从 deepseek.ts 复制 extractKeywords 函数进行测试
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

// 测试不同的输入
const testCases = [
  "狗狗今天洗澡了，很可爱",
  "狗狗今天洗澡了 特别可爱",
  "今天被领导批评了",
  "考试没考好",
  "加班到很晚",
  "随便说点什么",
];

console.log("=== 测试 extractKeywords 函数 ===\n");

testCases.forEach((input) => {
  const keywords = extractKeywords(input);
  console.log(`输入: "${input}"`);
  console.log(`提取的关键词: ${keywords.join("、")}`);
  console.log();
});
