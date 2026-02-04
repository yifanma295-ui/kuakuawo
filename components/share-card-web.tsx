import React from "react";
import { View, Text, Image, Platform } from "react-native";
import { toPng } from "html-to-image";

interface ShareCardWebProps {
  content: string;
  timestamp: number;
}

export const ShareCardWeb = React.forwardRef<HTMLDivElement, ShareCardWebProps>(
  ({ content, timestamp }, ref) => {
    const date = new Date(timestamp);
    const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
    const timeStr = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

    if (Platform.OS !== "web") {
      return null;
    }

    return (
      <div
        ref={ref}
        style={{
          width: "1080px",
          height: "1920px",
          background: "linear-gradient(180deg, #FFF8E7 0%, #FFECD2 50%, #FFE4D6 100%)",
          display: "flex",
          flexDirection: "column",
          padding: "120px 80px",
          justifyContent: "space-between",
          fontFamily: "'LXGW WenKai', system-ui, sans-serif",
        }}
      >
        {/* Logo 和 App 名称 */}
        <div style={{ textAlign: "center", marginTop: "60px" }}>
          <img
            src={require("@/assets/images/icon.png")}
            alt="夸夸我"
            style={{
              width: "160px",
              height: "160px",
              borderRadius: "40px",
              marginBottom: "32px",
            }}
          />
          <div
            style={{
              fontSize: "56px",
              fontWeight: "600",
              color: "#8B5A2B",
            }}
          >
            夸夸我
          </div>
        </div>

        {/* 夸奖内容 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "100px 0",
          }}
        >
          <div
            style={{
              fontSize: "52px",
              lineHeight: "84px",
              color: "#5D3A1A",
              textAlign: "center",
            }}
          >
            {content}
          </div>
        </div>

        {/* 时间戳 */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div
            style={{
              fontSize: "40px",
              color: "#8B5A2B",
              marginBottom: "12px",
            }}
          >
            {dateStr}
          </div>
          <div
            style={{
              fontSize: "36px",
              color: "#A0826D",
            }}
          >
            {timeStr}
          </div>
        </div>

        {/* 底部装饰 */}
        <div
          style={{
            textAlign: "center",
            paddingTop: "40px",
            borderTop: "2px solid rgba(139, 90, 43, 0.2)",
          }}
        >
          <div
            style={{
              fontSize: "32px",
              color: "#A0826D",
            }}
          >
            每一句温暖，都值得被记住
          </div>
        </div>
      </div>
    );
  }
);

ShareCardWeb.displayName = "ShareCardWeb";

/**
 * Web 版本：生成分享卡片并下载
 */
export async function generateShareCardWeb(
  content: string,
  timestamp: number,
  divRef: React.RefObject<HTMLDivElement | null>
): Promise<string | null> {
  try {
    if (!divRef.current) {
      console.error("Div ref is not available");
      return null;
    }

    // 使用 html-to-image 生成图片
    const dataUrl = await toPng(divRef.current, {
      width: 1080,
      height: 1920,
      pixelRatio: 2,
    });

    console.log("Share card generated (Web)");

    // 创建下载链接
    const link = document.createElement("a");
    link.download = `kuakuawo-${timestamp}.png`;
    link.href = dataUrl;
    link.click();

    return dataUrl;
  } catch (error) {
    console.error("Failed to generate share card (Web):", error);
    return null;
  }
}
