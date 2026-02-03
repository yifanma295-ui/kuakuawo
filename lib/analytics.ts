import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const VISITOR_ID_KEY = "@kuakuawo/visitor_id";

// 生成唯一访客 ID
function generateVisitorId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${randomPart}`;
}

// 获取或创建访客 ID
let cachedVisitorId: string | null = null;

export async function getVisitorId(): Promise<string> {
  if (cachedVisitorId) {
    return cachedVisitorId;
  }

  try {
    const stored = await AsyncStorage.getItem(VISITOR_ID_KEY);
    if (stored) {
      cachedVisitorId = stored;
      return stored;
    }

    const newId = generateVisitorId();
    await AsyncStorage.setItem(VISITOR_ID_KEY, newId);
    cachedVisitorId = newId;
    return newId;
  } catch (error) {
    // 如果 AsyncStorage 失败，使用临时 ID
    const tempId = generateVisitorId();
    cachedVisitorId = tempId;
    return tempId;
  }
}

// 获取 API 基础 URL
function getApiBaseUrl(): string {
  if (Platform.OS === "web") {
    // Web 环境使用相对路径
    return "";
  }
  // Native 环境使用完整 URL
  return process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
}

// 发送埋点请求
async function sendAnalytics(endpoint: string, data: Record<string, unknown>) {
  try {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/api/trpc/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.ok;
  } catch (error) {
    console.warn("[Analytics] Failed to send:", error);
    return false;
  }
}

// 记录页面访问
export async function trackPageView(pagePath: string) {
  const visitorId = await getVisitorId();
  
  const data = {
    visitorId,
    pagePath,
    userAgent: Platform.OS === "web" ? navigator?.userAgent : `${Platform.OS}/${Platform.Version}`,
    referrer: Platform.OS === "web" ? document?.referrer : undefined,
  };

  // 使用 tRPC mutation
  return sendAnalytics("analytics.recordPageView", { json: data });
}

// 记录昵称设置
export async function trackNickname(nickname: string) {
  const visitorId = await getVisitorId();
  
  return sendAnalytics("analytics.recordNickname", {
    json: { visitorId, nickname },
  });
}

// 记录主题点击
export async function trackThemeClick(themeId: string, themeName?: string) {
  const visitorId = await getVisitorId();
  
  return sendAnalytics("analytics.recordThemeClick", {
    json: { visitorId, themeId, themeName },
  });
}

// 导出访客 ID 供其他模块使用
export { cachedVisitorId };
