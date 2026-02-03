import axios from "axios";
import { getApiBaseUrl } from "@/constants/oauth";
import { getVisitorId } from "./analytics";

interface GeneratePraiseRequest {
  nickname: string;
  themeName: string;
  themeStyle: string;
  userInput?: string;
  themeId?: string;
}

interface GeneratePraiseResponse {
  success: boolean;
  praises: string[];
  praiseId?: number;
  error?: string;
}

export async function generatePraiseApi(
  data: GeneratePraiseRequest
): Promise<GeneratePraiseResponse> {
  try {
    const baseUrl = getApiBaseUrl();
    const visitorId = await getVisitorId();
    
    const response = await axios.post(
      `${baseUrl}/api/trpc/praise.generate`,
      { 
        json: {
          ...data,
          visitorId,
        } 
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    // tRPC 返回格式
    const result = response.data?.result?.data;
    if (result) {
      return result;
    }

    return {
      success: false,
      praises: [],
      error: "Invalid response format",
    };
  } catch (error) {
    console.error("API call failed:", error);
    return {
      success: false,
      praises: [],
      error: "Network error",
    };
  }
}

// 更新收藏状态
export async function updatePraiseSaveStatus(
  praiseId: number,
  isSaved: boolean,
  saveType?: string
): Promise<boolean> {
  try {
    const baseUrl = getApiBaseUrl();
    await axios.post(
      `${baseUrl}/api/trpc/praise.updateSaveStatus`,
      { 
        json: {
          praiseId,
          isSaved,
          saveType,
        } 
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );
    return true;
  } catch (error) {
    console.error("Failed to update save status:", error);
    return false;
  }
}
