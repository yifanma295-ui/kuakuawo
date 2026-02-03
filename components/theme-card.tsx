import React from "react";
import { Text, View, StyleSheet, Platform } from "react-native";
import { Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Theme } from "@/lib/store";

interface ThemeCardProps {
  theme: Theme;
  isSelected: boolean;
  onPress: () => void;
}

export function ThemeCard({ theme, isSelected, onPress }: ThemeCardProps) {
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
        pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
      ]}
    >
      {isSelected ? (
        <LinearGradient
          colors={["#FF9A8B", "#FF8A80"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      ) : (
        <View style={[StyleSheet.absoluteFillObject, styles.unselectedBg]} />
      )}
      
      <View style={styles.content}>
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
            { color: isSelected ? "#FFFFFF" : "#5D4037" },
          ]}
        >
          {theme.name}
        </Text>
        <Text
          style={[
            styles.description,
            { color: isSelected ? "rgba(255,255,255,0.85)" : "#8B5A2B" },
          ]}
          numberOfLines={2}
        >
          {theme.description}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: "45%",
    maxWidth: "48%",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  unselectedBg: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderWidth: 1,
    borderColor: "rgba(255, 138, 128, 0.2)",
    borderRadius: 16,
  },
  content: {
    padding: 16,
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
    fontFamily: "LXGWWenKai",
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "LXGWWenKai",
  },
});
