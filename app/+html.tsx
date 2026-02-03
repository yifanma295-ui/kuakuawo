import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";

/**
 * This file is web-only and used to configure the root HTML for every web page during static rendering.
 * The contents of this function only run in Node.js environments and do not have access to the DOM or browser APIs.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />

        {/* 基础 SEO */}
        <title>夸夸我 - 给自己一点温暖</title>
        <meta name="description" content="夸夸我是一款温暖治愈的自我肯定应用，用AI生成个性化夸奖，帮助你建立积极的心理暗示。" />
        <meta name="keywords" content="夸夸我,自我肯定,心理健康,正能量,AI夸奖,治愈系" />
        <meta name="author" content="夸夸我" />

        {/* Open Graph / 微信分享 */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="夸夸我 - 给自己一点温暖" />
        <meta property="og:description" content="用AI生成个性化夸奖，帮助你建立积极的心理暗示，每天都要好好夸夸自己。" />
        <meta property="og:site_name" content="夸夸我" />
        <meta property="og:locale" content="zh_CN" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="夸夸我 - 给自己一点温暖" />
        <meta name="twitter:description" content="用AI生成个性化夸奖，帮助你建立积极的心理暗示。" />

        {/* 移动端优化 */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="夸夸我" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#FFF8E7" />
        <meta name="msapplication-TileColor" content="#FFF8E7" />

        {/* 禁止自动检测电话号码 */}
        <meta name="format-detection" content="telephone=no" />

        {/* 字体预加载 - 使用 CDN 加速 */}
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/style.css"
          as="style"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/style.css"
        />

        {/* 使用 expo-router 的 ScrollViewStyleReset 来修复 web 滚动 */}
        <ScrollViewStyleReset />

        {/* 自定义样式 */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html, body, #root {
                height: 100%;
                margin: 0;
                padding: 0;
                overflow: hidden;
              }
              
              body {
                font-family: 'LXGW WenKai', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                background-color: #FFF8E7;
              }
              
              /* 隐藏滚动条但保持滚动功能 */
              ::-webkit-scrollbar {
                display: none;
              }
              
              * {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
              
              /* 移动端触摸优化 */
              * {
                -webkit-tap-highlight-color: transparent;
                -webkit-touch-callout: none;
              }
              
              /* 防止文本选择 */
              body {
                -webkit-user-select: none;
                user-select: none;
              }
              
              /* 允许输入框选择 */
              input, textarea {
                -webkit-user-select: auto;
                user-select: auto;
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
