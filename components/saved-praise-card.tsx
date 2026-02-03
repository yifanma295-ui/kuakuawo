import React from "react";
import { Text, View, StyleSheet, Platform, Share } from "react-native";
import { Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
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
  const colors = useColors();
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
      default:
        return "";
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      {/* 头部信息 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.emoji}>{theme?.emoji || "✨"}</Text>
          <Text style={[styles.themeName, { color: colors.muted }]}>
            {theme?.name || "未知主题"}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <View
            style={[
              styles.typeTag,
              { backgroundColor: colors.primary + "20" },
            ]}
          >
            <Text style={[styles.typeText, { color: colors.primary }]}>
              {getTypeLabel(praise.type)}
            </Text>
          </View>
          <Text style={[styles.date, { color: colors.muted }]}>
            {formatDate(praise.createdAt)}
          </Text>
        </View>
      </View>

      {/* 夸奖内容 */}
      <Text style={[styles.content, { color: colors.foreground }]}>
        {praise.content}
      </Text>

      {/* 用户输入（如果有） */}
      {praise.input && (
        <View
          style={[
            styles.inputContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <Text style={[styles.inputLabel, { color: colors.muted }]}>
            因为：
          </Text>
          <Text style={[styles.inputText, { color: colors.foreground }]}>
            {praise.input}
          </Text>
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
          <IconSymbol name="square.and.arrow.up" size={20} color={colors.muted} />
          <Text style={[styles.actionText, { color: colors.muted }]}>分享</Text>
        </Pressable>
        <Pressable
          onPress={handleDelete}
          style={({ pressed }) => [
            styles.actionButton,
            pressed && { opacity: 0.6 },
          ]}
        >
          <IconSymbol name="heart.fill" size={20} color={colors.primary} />
          <Text style={[styles.actionText, { color: colors.primary }]}>
            取消收藏
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
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
  },
  date: {
    fontSize: 12,
  },
  content: {
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
  },
  inputText: {
    fontSize: 14,
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    fontSize: 14,
  },
});
