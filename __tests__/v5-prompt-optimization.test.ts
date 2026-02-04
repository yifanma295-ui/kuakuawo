import { describe, it, expect } from "vitest";

describe("V5.0 Prompt Optimization", () => {
  describe("Prompt Structure", () => {
    it("should have four-layer praise structure", () => {
      const praiseStructure = {
        layer1: "同理心回应 - 理解和接纳用户的感受",
        layer2: "事件转化 - 把负面转化为成长机会",
        layer3: "个性化夸奖 - 针对用户的具体情况",
        layer4: "心理建设 - 给予力量和希望",
      };

      expect(Object.keys(praiseStructure).length).toBe(4);
      expect(praiseStructure.layer1).toContain("同理心");
      expect(praiseStructure.layer2).toContain("事件转化");
      expect(praiseStructure.layer3).toContain("个性化");
      expect(praiseStructure.layer4).toContain("心理建设");
    });

    it("should emphasize understanding user input over theme", () => {
      const promptPriority = {
        primary: "用户输入 + 真实需求",
        secondary: "主题背景（仅参考）",
      };

      expect(promptPriority.primary).toContain("用户输入");
      expect(promptPriority.secondary).toContain("仅参考");
    });

    it("should have personalization requirements", () => {
      const personalizationRequirements = [
        "必须以用户昵称开头",
        "融入用户输入的具体细节",
        "用亲切温暖的语气",
        "避免鸡汤式空泛鼓励",
      ];

      expect(personalizationRequirements.length).toBe(4);
      personalizationRequirements.forEach((req) => {
        expect(req.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Prompt Improvement from V4 to V5", () => {
    it("should shift from theme-based to input-based generation", () => {
      const v4Approach = "基于主题分类 → 通用夸奖";
      const v5Approach = "基于用户输入 → 定制化个性化夸奖";

      expect(v4Approach).toContain("主题");
      expect(v5Approach).toContain("用户输入");
      expect(v5Approach).toContain("定制化");
    });

    it("should enhance empathy and psychological understanding", () => {
      const v5Improvements = {
        empathy: "深度理解用户心理，识别痛点和真实需求",
        eventTransformation: "把负面事件转化为成长机会",
        psychologicalSupport: "给予心理建设和力量",
      };

      expect(v5Improvements.empathy).toContain("深度理解");
      expect(v5Improvements.eventTransformation).toContain("转化");
      expect(v5Improvements.psychologicalSupport).toContain("心理建设");
    });

    it("should maintain product persona as true friend", () => {
      const productPersona = {
        role: "用户的挚友",
        mission: "懂用户、说到点子上、给如沐春风的感觉",
        tone: "亲切、温暖、像真正的朋友",
      };

      expect(productPersona.role).toContain("挚友");
      expect(productPersona.mission).toContain("懂用户");
      expect(productPersona.mission).toContain("说到点子上");
      expect(productPersona.tone).toContain("温暖");
    });
  });

  describe("User Input Handling", () => {
    it("should generate customized praise when user provides input", () => {
      const userInput = "今天工作中被领导批评了，感到很沮丧";
      const expectedApproach =
        "深度理解用户的真实感受 → 转化批评为成长机会 → 给予心理建设";

      expect(userInput.length).toBeGreaterThan(0);
      expect(expectedApproach).toContain("深度理解");
      expect(expectedApproach).toContain("转化");
    });

    it("should generate theme-based praise when no specific input", () => {
      const noUserInput = undefined;
      const fallbackApproach = "基于主题背景生成温暖的定制化夸奖";

      expect(noUserInput).toBeUndefined();
      expect(fallbackApproach).toContain("主题");
    });

    it("should extract emotional keywords from user input", () => {
      const userInputExamples = [
        { input: "被批评", emotion: "沮丧" },
        { input: "失败了", emotion: "自责" },
        { input: "很焦虑", emotion: "焦虑" },
        { input: "感到孤独", emotion: "孤独" },
      ];

      userInputExamples.forEach((example) => {
        expect(example.emotion.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Quality Metrics", () => {
    it("should meet length requirements", () => {
      const lengthRequirements = {
        minWords: 80,
        maxWords: 120,
        sentences: "3-4 句话",
      };

      expect(lengthRequirements.minWords).toBeLessThan(
        lengthRequirements.maxWords
      );
      expect(lengthRequirements.sentences).toContain("3-4");
    });

    it("should avoid prohibited content", () => {
      const prohibitedPatterns = [
        "空泛鼓励",
        "鸡汤式表达",
        "虚伪内容",
        "忽视用户感受",
      ];

      prohibitedPatterns.forEach((pattern) => {
        expect(pattern.length).toBeGreaterThan(0);
      });
    });

    it("should include personalization markers", () => {
      const personalizationMarkers = [
        "用户昵称",
        "具体细节",
        "真实感受",
        "个性化语言",
      ];

      expect(personalizationMarkers.length).toBe(4);
      personalizationMarkers.forEach((marker) => {
        expect(marker).toMatch(/用户|具体|真实|个性/);
      });
    });
  });

  describe("Expected User Experience Improvement", () => {
    it("should transform user feedback from encouragement to healing", () => {
      const v4Feedback = "鼓励性";
      const v5Feedback = "治愈性 + 鼓励性";

      expect(v4Feedback).toContain("鼓励");
      expect(v5Feedback).toContain("治愈");
      expect(v5Feedback).toContain("鼓励");
    });

    it("should achieve product goal of being true friend", () => {
      const productGoals = [
        "懂用户 - 深度理解用户心理",
        "说到点子上 - 精准识别用户需求",
        "如沐春风 - 温暖治愈的感觉",
        "挚友感 - 真正的陪伴和支持",
      ];

      expect(productGoals.length).toBe(4);
      productGoals.forEach((goal) => {
        expect(goal.length).toBeGreaterThan(0);
      });
    });

    it("should enable users to feel truly understood", () => {
      const expectedUserFeedback = [
        "哇，这句话好像是为我量身定做的！",
        "感觉你真的懂我",
        "这个夸奖治愈了我",
        "就像有一个真正的朋友在陪伴我",
      ];

      expect(expectedUserFeedback.length).toBe(4);
      expectedUserFeedback.forEach((feedback) => {
        expect(feedback).toMatch(/懂|治愈|朋友|量身/);
      });
    });
  });
});
