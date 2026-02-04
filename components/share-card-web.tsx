import React from "react";
import { Platform } from "react-native";
import { toPng } from "html-to-image";

interface ShareCardWebProps {
  content: string;
  timestamp: number;
}

// 内联 SVG Logo（避免图片加载问题）
const LogoSvg = () => (
  <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="160" height="160" rx="40" fill="url(#gradient)" />
    <defs>
      <linearGradient id="gradient" x1="0" y1="0" x2="160" y2="160" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFE4D6" />
        <stop offset="1" stopColor="#FFECD2" />
      </linearGradient>
    </defs>
    {/* 心形图标 */}
    <path
      d="M80 130C80 130 35 95 35 65C35 45 50 30 70 30C78 30 80 35 80 35C80 35 82 30 90 30C110 30 125 45 125 65C125 95 80 130 80 130Z"
      fill="#FF8A80"
    />
  </svg>
);

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
          width: "360px",
          height: "640px",
          background: "linear-gradient(180deg, #FFF8E7 0%, #FFECD2 50%, #FFE4D6 100%)",
          display: "flex",
          flexDirection: "column",
          padding: "40px 28px",
          justifyContent: "space-between",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
        }}
      >
        {/* Logo 和 App 名称 */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          {/* 使用纯 CSS 绘制心形 */}
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #FFE4D6 0%, #FFECD2 100%)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 auto 12px",
              boxShadow: "0 4px 12px rgba(255, 138, 128, 0.3)",
            }}
          >
            <div
              style={{
                fontSize: "28px",
              }}
            >
              💕
            </div>
          </div>
          <div
            style={{
              fontSize: "20px",
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
            padding: "32px 0",
          }}
        >
          <div
            style={{
              fontSize: "18px",
              lineHeight: "30px",
              color: "#5D3A1A",
              textAlign: "center",
            }}
          >
            {content}
          </div>
        </div>

        {/* 时间戳 */}
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <div
            style={{
              fontSize: "14px",
              color: "#8B5A2B",
              marginBottom: "4px",
            }}
          >
            {dateStr}
          </div>
          <div
            style={{
              fontSize: "12px",
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
            paddingTop: "16px",
            borderTop: "1px solid rgba(139, 90, 43, 0.2)",
          }}
        >
          <div
            style={{
              fontSize: "11px",
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
      console.error("[ShareCardWeb] Div ref is not available");
      return null;
    }

    console.log("[ShareCardWeb] Starting to generate card...");

    // 临时显示元素以便截图
    const originalStyle = divRef.current.style.cssText;
    divRef.current.style.position = "fixed";
    divRef.current.style.left = "0";
    divRef.current.style.top = "0";
    divRef.current.style.zIndex = "9999";

    // 等待一帧确保渲染完成
    await new Promise((resolve) => requestAnimationFrame(resolve));

    // 使用 html-to-image 生成图片
    const dataUrl = await toPng(divRef.current, {
      width: 360,
      height: 640,
      pixelRatio: 3, // 高清输出
      backgroundColor: "#FFF8E7",
    });

    // 恢复原始样式
    divRef.current.style.cssText = originalStyle;

    console.log("[ShareCardWeb] Card generated successfully");

    // 创建下载链接
    const link = document.createElement("a");
    link.download = `kuakuawo-${timestamp}.png`;
    link.href = dataUrl;
    link.click();

    return dataUrl;
  } catch (error) {
    console.error("[ShareCardWeb] Failed to generate share card:", error);
    return null;
  }
}
