import React from "react";
import { Text, View, StyleSheet, ScrollView, Platform } from "react-native";
import { Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/use-colors";

export type FilterType = "all" | "self" | "others" | "highlight";

interface FilterTabsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const FILTERS: { id: FilterType; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "self", label: "致自己" },
  { id: "others", label: "予他人" },
  { id: "highlight", label: "高光时刻" },
];

export function FilterTabs({ activeFilter, onFilterChange }: FilterTabsProps) {
  const colors = useColors();

  const handlePress = (filter: FilterType) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onFilterChange(filter);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter.id;
        return (
          <Pressable
            key={filter.id}
            onPress={() => handlePress(filter.id)}
            style={({ pressed }) => [
              styles.tab,
              {
                backgroundColor: isActive ? colors.primary : colors.surface,
                borderColor: isActive ? colors.primary : colors.border,
              },
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { color: isActive ? "#FFFFFF" : colors.foreground },
              ]}
            >
              {filter.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 10,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
