import { Theme } from "./store";
import { generatePraiseApi } from "./api";

// 预设的夸奖模板库，作为 API 失败时的后备方案
const PRAISE_TEMPLATES: Record<string, string[]> = {
  loneliness: [
    "{name}，独处的时光是你与自己深度对话的珍贵礼物。在这份宁静里，你正在慢慢发现一个更完整的自己，这是多么难得的自我探索之旅。",
    "{name}，一个人的时候，你并不孤单，因为你拥有最忠实的陪伴——那就是你自己。你的内心世界如此丰富，值得被好好珍惜。",
    "{name}，能够享受独处的人，内心一定有着温柔的力量。你正在学会与自己和解，这份成长比什么都珍贵。",
  ],
  happiness: [
    "{name}，你发现的这份小美好，就像阳光透过树叶洒下的光斑，温暖而治愈。感谢你愿意停下来，用心感受生活的温度。",
    "{name}，能在平凡日子里捕捉到幸福的人，一定有一颗柔软细腻的心。你的眼睛里住着星星，所以才能看见生活里的光。",
    "{name}，这份小确幸被你记录下来，就变成了永恒的美好。你正在用自己的方式，编织一本独一无二的幸福日记。",
  ],
  motivation: [
    "{name}，迈出第一步的你已经很棒了。不必着急，慢慢来，每一小步都是在靠近更好的自己。",
    "{name}，想要开始的念头本身就是一种力量。相信自己，你比想象中更有能力完成这件事。",
    "{name}，拖延不是懒惰，只是在等待最好的时机。现在，这个时机来了，而你已经准备好了。",
  ],
  study: [
    "{name}，每一个认真学习的时刻，都是在为未来的自己铺路。你的努力，时间都看得见。",
    "{name}，疲惫是因为你在用心付出。休息一下也没关系，你已经做得很好了。知识正在悄悄地在你心里生根发芽。",
    "{name}，能够坚持学习的人，一定有着不凡的毅力。你的智慧和努力，终将带你去想去的地方。",
  ],
  work: [
    "{name}，职场上的你，专业又靠谱。每一份认真对待的工作，都在证明你的价值。你值得被看见，被认可。",
    "{name}，工作中的挑战是成长的阶梯。你处理问题的方式，展现了你的专业素养和沉稳心态。",
    "{name}，今天的付出，是明天成就的基石。你在职场上的每一步，都走得稳健而有力。",
  ],
  pregnancy: [
    "{name}，你正在孕育一个小小的奇迹，这是世界上最温柔、最伟大的事情。你的身体在创造生命，这份力量令人敬畏。",
    "{name}，每一天，你都在用爱滋养着肚子里的小生命。你是如此温柔而坚强，你们的连接是最美的纽带。",
    "{name}，孕育生命的你，散发着母性的光芒。不管身体有多少变化，你都是最美丽的准妈妈。",
  ],
  parenting: [
    "{name}，做父母没有标准答案，但你的爱就是最好的答案。孩子很幸运，能有你这样用心的爸爸/妈妈。",
    "{name}，育儿路上的每一份辛苦，都是爱的证明。你正在用自己的方式，给孩子最好的陪伴和成长。",
    "{name}，新手爸妈的焦虑很正常，但请相信，你做得比自己想象的要好得多。孩子感受到的，是满满的爱。",
  ],
  pets: [
    "{name}，你对毛孩子的爱，它们都感受得到。能遇到你这样的主人，是它们最大的幸运。",
    "{name}，照顾小生命需要耐心和爱心，而你两样都有。你和毛孩子之间的默契，是最温暖的羁绊。",
    "{name}，铲屎官的日常虽然琐碎，但每一个细节都是爱的表达。你们之间的故事，比任何童话都动人。",
  ],
  traveler: [
    "{name}，在异乡打拼的你，有着让人敬佩的勇气和坚韧。家乡的风会穿越千山万水，轻轻拥抱努力的你。",
    "{name}，想家的时候，记得你并不孤单。你的坚持和努力，正在为自己创造一个更广阔的未来。",
    "{name}，异乡的星空下，你独自闪耀着光芒。这份独立和坚强，是你送给自己最好的礼物。",
  ],
};

// 后备生成函数（当 API 不可用时使用）
function generateFallbackPraise(
  nickname: string,
  theme: Theme,
  _input?: string
): string[] {
  const templates = PRAISE_TEMPLATES[theme.id] || PRAISE_TEMPLATES.happiness;
  const shuffled = [...templates].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(2, shuffled.length));
  return selected.map((t) => t.replace("{name}", nickname));
}

// 主生成函数 - 使用 DeepSeek API
export async function generatePraise(
  nickname: string,
  theme: Theme,
  input?: string
): Promise<string[]> {
  try {
    // 调用后端 API 生成夸奖
    const result = await generatePraiseApi({
      nickname,
      themeName: theme.name,
      themeStyle: theme.style,
      userInput: input || undefined,
    });

    if (result.success && result.praises.length > 0) {
      return result.praises;
    }

    // API 返回失败，使用后备方案
    console.warn("API returned no praises, using fallback");
    return generateFallbackPraise(nickname, theme, input);
  } catch (error) {
    // API 调用失败，使用后备方案
    console.error("Failed to generate praise via API:", error);
    return generateFallbackPraise(nickname, theme, input);
  }
}
