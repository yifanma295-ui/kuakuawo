import React from "react";
import { Text, View, StyleSheet, Platform, Share } from "react-native";
import { Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { SavedPraise, THEMES } from "@/lib/store";

interface SavedPraiseCardProps {
  praise: SavedPraise;
  onDelete: () => void;
  onShare: () => void;
}

export function SavedPraiseCard({
  praise,
  onDelete,
  onShare,
}: SavedPraiseCardProps) {
  const theme = THEMES.find((t) => t.id === praise.themeId);

  const handleShare = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    try {
      await Share.share({
        message: praise.content,
      });
      onShare();
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  const handleDelete = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onDelete();
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  };

  const getTypeLabel = (type: SavedPraise["type"]) => {
    switch (type) {
      case "self":
        return "致自己";
      case "others":
        return "予他人";
      case "highlight":
        return "高光时刻";
      case "echo":
        return "分享共鸣";
      default:
        return "";
    }
  };

  const getTypeColor = (type: SavedPraise["type"]) => {
    switch (type) {
      case "highlight":
        return "#FFB74D";
      case "others":
        return "#81C784";
      case "echo":
        return "#87CEEB";
      default:
        return "#FF8A80";
    }
  };

  return (
    <View style={styles.card}>
      {/* 头部信息 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.emoji}>{theme?.emoji || "✨"}</Text>
          <Text style={styles.themeName}>{theme?.name || "未知主题"}</Text>
        </View>
        <View style={styles.headerRight}>
          <View
            style={[
              styles.typeTag,
              { backgroundColor: getTypeColor(praise.type) + "25" },
            ]}
          >
            <Text style={[styles.typeText, { color: getTypeColor(praise.type) }]}>
              {getTypeLabel(praise.type)}
            </Text>
          </View>
          <Text style={styles.date}>{formatDate(praise.createdAt)}</Text>
        </View>
      </View>

      {/* 夸奖内容 */}
      <Text style={styles.content}>{praise.content}</Text>

      {/* 用户输入（如果有） */}
      {praise.input && (
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>因为：</Text>
          <Text style={styles.inputText}>{praise.input}</Text>
        </View>
      )}

      {/* 操作按钮 */}
      <View style={styles.actions}>
        <Pressable
          onPress={handleShare}
          style={({ pressed }) => [
            styles.actionButton,
            pressed && { opacity: 0.6 },
          ]}
        >
          <IconSymbol name="square.and.arrow.up" size={18} color="#8B5A2B" />
          <Text style={styles.actionText}>分享</Text>
        </Pressable>
        <Pressable
          onPress={handleDelete}
          style={({ pressed }) => [
            styles.actionButton,
            pressed && { opacity: 0.6 },
          ]}
        >
          <IconSymbol name="heart.fill" size={18} color="#FF8A80" />
          <Text style={[styles.actionText, { color: "#FF8A80" }]}>取消收藏</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderWidth: 1,
    borderColor: "rgba(255, 138, 128, 0.15)",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  emoji: {
    fontSize: 20,
  },
  themeName: {
    fontSize: 14,
    color: "#8B5A2B",
    fontFamily: "LXGWWenKai",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "500",
    fontFamily: "LXGWWenKai",
  },
  date: {
    fontSize: 12,
    color: "#8B5A2B",
    opacity: 0.6,
    fontFamily: "LXGWWenKai",
  },
  content: {
    fontSize: 16,
    lineHeight: 28,
    color: "#5D4037",
    marginBottom: 12,
    fontFamily: "LXGWWenKai",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    color: "#8B5A2B",
    opacity: 0.7,
    fontFamily: "LXGWWenKai",
  },
  inputText: {
    fontSize: 14,
    color: "#5D4037",
    flex: 1,
    fontFamily: "LXGWWenKai",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(139, 90, 43, 0.08)",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: "#8B5A2B",
    fontFamily: "LXGWWenKai",
  },
});
