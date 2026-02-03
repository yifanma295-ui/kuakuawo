import React from "react";
import { Text, View, StyleSheet, Platform } from "react-native";
import { Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { Theme } from "@/lib/store";

interface ThemeCardProps {
  theme: Theme;
  isSelected: boolean;
  onPress: () => void;
}

export function ThemeCard({ theme, isSelected, onPress }: ThemeCardProps) {
  const colors = useColors();

  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: isSelected ? colors.primary : colors.surface,
          borderColor: isSelected ? colors.primary : colors.border,
        },
        pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.emoji}>{theme.emoji}</Text>
        {isSelected && (
          <IconSymbol
            name="checkmark.circle.fill"
            size={20}
            color="#FFFFFF"
          />
        )}
      </View>
      <Text
        style={[
          styles.name,
          { color: isSelected ? "#FFFFFF" : colors.foreground },
        ]}
      >
        {theme.name}
      </Text>
      <Text
        style={[
          styles.description,
          { color: isSelected ? "rgba(255,255,255,0.8)" : colors.muted },
        ]}
        numberOfLines={2}
      >
        {theme.description}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: "45%",
    maxWidth: "48%",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  emoji: {
    fontSize: 28,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
});
