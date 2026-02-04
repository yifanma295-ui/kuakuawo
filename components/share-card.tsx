import React, { useRef } from "react";
import { View, Text, StyleSheet, Image, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ViewShot from "react-native-view-shot";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";

interface ShareCardProps {
  content: string;
  timestamp: number;
  onCapture?: (uri: string) => void;
}

export const ShareCard = React.forwardRef<ViewShot, ShareCardProps>(
  ({ content, timestamp }, ref) => {
    const date = new Date(timestamp);
    const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
    const timeStr = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

    return (
      <ViewShot
        ref={ref}
        options={{
          format: "png",
          quality: 1.0,
          width: 1080,
          height: 1920,
        }}
        style={styles.container}
      >
        <LinearGradient
          colors={["#FFF8E7", "#FFECD2", "#FFE4D6"]}
          style={StyleSheet.absoluteFillObject}
        />
        
        <View style={styles.content}>
          {/* Logo 和 App 名称 */}
          <View style={styles.header}>
            <Image
              source={require("@/assets/images/icon.png")}
              style={styles.logo}
            />
            <Text style={styles.appName}>夸夸我</Text>
          </View>

          {/* 夸奖内容 */}
          <View style={styles.praiseContainer}>
            <Text style={styles.praiseText}>{content}</Text>
          </View>

          {/* 时间戳 */}
          <View style={styles.footer}>
            <Text style={styles.dateText}>{dateStr}</Text>
            <Text style={styles.timeText}>{timeStr}</Text>
          </View>

          {/* 底部装饰 */}
          <View style={styles.decoration}>
            <Text style={styles.decorationText}>每一句温暖，都值得被记住</Text>
          </View>
        </View>
      </ViewShot>
    );
  }
);

ShareCard.displayName = "ShareCard";

const styles = StyleSheet.create({
  container: {
    width: 1080,
    height: 1920,
    backgroundColor: "#FFF8E7",
  },
  content: {
    flex: 1,
    paddingHorizontal: 80,
    paddingVertical: 120,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    marginTop: 60,
  },
  logo: {
    width: 160,
    height: 160,
    borderRadius: 40,
    marginBottom: 32,
  },
  appName: {
    fontSize: 56,
    fontWeight: "600",
    color: "#8B5A2B",
    fontFamily: Platform.select({
      ios: "LXGW WenKai",
      android: "LXGW WenKai",
      default: "system-ui",
    }),
  },
  praiseContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 100,
  },
  praiseText: {
    fontSize: 52,
    lineHeight: 84,
    color: "#5D3A1A",
    textAlign: "center",
    fontFamily: Platform.select({
      ios: "LXGW WenKai",
      android: "LXGW WenKai",
      default: "system-ui",
    }),
  },
  footer: {
    alignItems: "center",
    marginBottom: 40,
  },
  dateText: {
    fontSize: 40,
    color: "#8B5A2B",
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: "LXGW WenKai",
      android: "LXGW WenKai",
      default: "system-ui",
    }),
  },
  timeText: {
    fontSize: 36,
    color: "#A0826D",
    fontFamily: Platform.select({
      ios: "LXGW WenKai",
      android: "LXGW WenKai",
      default: "system-ui",
    }),
  },
  decoration: {
    alignItems: "center",
    paddingTop: 40,
    borderTopWidth: 2,
    borderTopColor: "rgba(139, 90, 43, 0.2)",
  },
  decorationText: {
    fontSize: 32,
    color: "#A0826D",
    fontFamily: Platform.select({
      ios: "LXGW WenKai",
      android: "LXGW WenKai",
      default: "system-ui",
    }),
  },
});

/**
 * 生成分享卡片并保存/分享
 */
export async function generateShareCard(
  content: string,
  timestamp: number,
  viewShotRef: React.RefObject<ViewShot | null>
): Promise<string | null> {
  try {
    if (!viewShotRef.current) {
      console.error("ViewShot ref is not available");
      return null;
    }

    // 捕获截图
    const uri = await viewShotRef.current?.capture?.();
    if (!uri) {
      console.error("Failed to capture view");
      return null;
    }
    console.log("Share card generated:", uri);

    // Web 平台：直接返回 URI
    if (Platform.OS === "web") {
      return uri;
    }

    // 移动平台：请求权限并保存到相册
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === "granted") {
      await MediaLibrary.saveToLibraryAsync(uri);
      console.log("Share card saved to library");
    }

    // 检查是否支持分享
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(uri, {
        mimeType: "image/png",
        dialogTitle: "分享夸夸我卡片",
      });
    }

    return uri;
  } catch (error) {
    console.error("Failed to generate share card:", error);
    return null;
  }
}
