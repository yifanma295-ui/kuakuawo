import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const VISITOR_ID_KEY = "@kuakuawo_visitor_id";

/**
 * 生成唯一访客 ID
 */
function generateVisitorId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${randomPart}`;
}

/**
 * 获取或创建访客 ID
 */
export async function getVisitorId(): Promise<string> {
  try {
    let visitorId = await AsyncStorage.getItem(VISITOR_ID_KEY);
    if (!visitorId) {
      visitorId = generateVisitorId();
      await AsyncStorage.setItem(VISITOR_ID_KEY, visitorId);
    }
    return visitorId;
  } catch (error) {
    console.warn("[Analytics] Failed to get visitor ID:", error);
    return generateVisitorId();
  }
}

/**
 * 获取 API 基础 URL
 */
function getApiBaseUrl(): string {
  if (Platform.OS === "web") {
    return "";
  }
  // 移动端需要完整 URL
  return process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
}

/**
 * 发送埋点请求
 */
async function sendAnalytics(endpoint: string, data: Record<string, unknown>): Promise<void> {
  try {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/api/trpc/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      console.warn(`[Analytics] Failed to send ${endpoint}:`, response.status);
    }
  } catch (error) {
    console.warn(`[Analytics] Failed to send ${endpoint}:`, error);
  }
}

/**
 * 记录页面访问
 */
export async function trackPageView(pagePath: string): Promise<void> {
  const visitorId = await getVisitorId();
  const userAgent = Platform.OS === "web" 
    ? (typeof navigator !== "undefined" ? navigator.userAgent : "unknown")
    : `${Platform.OS}/${Platform.Version}`;
  
  await sendAnalytics("analytics.recordPageView", {
    visitorId,
    pagePath,
    userAgent,
  });
}

/**
 * 记录用户昵称
 */
export async function trackNickname(nickname: string): Promise<void> {
  const visitorId = await getVisitorId();
  
  await sendAnalytics("analytics.recordNickname", {
    visitorId,
    nickname,
  });
}

/**
 * 记录主题点击
 */
export async function trackThemeClick(themeId: string, themeName: string): Promise<void> {
  const visitorId = await getVisitorId();
  
  await sendAnalytics("analytics.recordThemeClick", {
    visitorId,
    themeId,
    themeName,
  });
}

/**
 * 获取当前访客 ID（用于夸奖生成时传递）
 */
export { getVisitorId as getCurrentVisitorId };
