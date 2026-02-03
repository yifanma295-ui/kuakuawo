import axios from "axios";
import { getApiBaseUrl } from "@/constants/oauth";

interface GeneratePraiseRequest {
  nickname: string;
  themeName: string;
  themeStyle: string;
  userInput?: string;
}

interface GeneratePraiseResponse {
  success: boolean;
  praises: string[];
  error?: string;
}

export async function generatePraiseApi(
  data: GeneratePraiseRequest
): Promise<GeneratePraiseResponse> {
  try {
    const baseUrl = getApiBaseUrl();
    const response = await axios.post(
      `${baseUrl}/api/trpc/praise.generate`,
      { json: data },
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
