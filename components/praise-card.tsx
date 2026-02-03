import React, { useEffect } from "react";
import { Text, View, StyleSheet, Platform, Share } from "react-native";
import { Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface PraiseCardProps {
  content: string;
  index?: number;
  onSave?: (type: "self" | "others" | "highlight") => void;
  onShare?: () => void;
  isSaved?: boolean;
}

export function PraiseCard({
  content,
  index = 0,
  onSave,
  onShare,
  isSaved = false,
}: PraiseCardProps) {
  const colors = useColors();
  const translateY = useSharedValue(30);
  const opacity = useSharedValue(0);
  const [saved, setSaved] = React.useState(isSaved);

  useEffect(() => {
    const delay = index * 100;
    translateY.value = withDelay(
      delay,
      withTiming(0, { duration: 400, easing: Easing.out(Easing.ease) })
    );
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) })
    );
  }, [index, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const handleSave = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSaved(!saved);
    if (!saved && onSave) {
      onSave("self");
    }
  };

  const handleShare = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    try {
      await Share.share({
        message: content,
      });
      if (onShare) {
        onShare();
      }
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        animatedStyle,
      ]}
    >
      <Text style={[styles.content, { color: colors.foreground }]}>
        {content}
      </Text>
      <View style={styles.actions}>
        <Pressable
          onPress={handleSave}
          style={({ pressed }) => [
            styles.actionButton,
            pressed && { opacity: 0.6 },
          ]}
        >
          <IconSymbol
            name={saved ? "heart.fill" : "heart"}
            size={22}
            color={saved ? colors.primary : colors.muted}
          />
          <Text
            style={[
              styles.actionText,
              { color: saved ? colors.primary : colors.muted },
            ]}
          >
            {saved ? "已收藏" : "收藏"}
          </Text>
        </Pressable>
        <Pressable
          onPress={handleShare}
          style={({ pressed }) => [
            styles.actionButton,
            pressed && { opacity: 0.6 },
          ]}
        >
          <IconSymbol name="square.and.arrow.up" size={22} color={colors.muted} />
          <Text style={[styles.actionText, { color: colors.muted }]}>分享</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  content: {
    fontSize: 17,
    lineHeight: 28,
    marginBottom: 16,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
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
