import { generatePraiseWithDeepSeek } from "./server/deepseek";

/**
 * 测试场景：狗狗洗澡
 * 验证 V5.3 是否能在第一句话中包含关键词"洗澡"或"狗狗"
 */
async function testDogBath() {
  console.log("=== 测试场景：狗狗洗澡 ===\n");
  
  const nickname = "小美";
  const themeName = "铲屎官日常";
  const themeStyle = "温暖治愈";
  const userInput = "狗狗今天洗澡了，很可爱";
  
  console.log("用户昵称:", nickname);
  console.log("主题:", themeName);
  console.log("用户输入:", userInput);
  console.log("\n正在调用 DeepSeek API...\n");
  
  try {
    const praises = await generatePraiseWithDeepSeek(
      nickname,
      themeName,
      themeStyle,
      userInput
    );
    
    console.log("=== AI 生成的夸奖 ===\n");
    praises.forEach((praise, index) => {
      console.log(`夸奖 ${index + 1}:`);
      console.log(praise);
      console.log();
    });
    
    // 验证第一句话是否包含关键词
    console.log("=== 验证结果 ===\n");
    const firstPraise = praises[0] || "";
    // 第一句话是第一个句号、问号或感叹号之前的内容
    const firstSentence = firstPraise.split(/[。！？]/)[0];
    
    console.log("第一句完整句:", firstSentence);
    
    const hasKeyword = 
      firstSentence.includes("洗澡") || 
      firstSentence.includes("狗狗") ||
      firstSentence.includes("宠物") ||
      firstSentence.includes("毛孩子");
    
    if (hasKeyword) {
      console.log("\n✅ 通过：第一句话包含关键词");
      if (firstSentence.includes("洗澡")) {
        console.log("   找到关键词：洗澡");
      }
      if (firstSentence.includes("狗狗")) {
        console.log("   找到关键词：狗狗");
      }
    } else {
      console.log("\n❌ 失败：第一句话没有包含关键词");
      console.log("   期望包含：洗澡、狗狗、宠物、毛孩子");
    }
    
  } catch (error) {
    console.error("测试失败:", error);
    if (error instanceof Error) {
      console.error("错误信息:", error.message);
    }
  }
}

// 运行测试
testDogBath();
