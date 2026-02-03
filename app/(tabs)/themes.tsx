import React, { useCallback } from "react";
import { Text, View, StyleSheet, FlatList, Platform } from "react-native";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { ThemeCard } from "@/components/theme-card";
import { useApp } from "@/lib/app-context";
import { THEMES, Theme } from "@/lib/store";
import { useColors } from "@/hooks/use-colors";

export default function ThemesScreen() {
  const colors = useColors();
  const { state, setDefaultTheme } = useApp();

  const handleSelectTheme = useCallback(
    (themeId: string) => {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      setDefaultTheme(themeId);
    },
    [setDefaultTheme]
  );

  const renderThemeCard = useCallback(
    ({ item }: { item: Theme }) => (
      <ThemeCard
        theme={item}
        isSelected={state.defaultThemeId === item.id}
        onPress={() => handleSelectTheme(item.id)}
      />
    ),
    [state.defaultThemeId, handleSelectTheme]
  );

  const keyExtractor = useCallback((item: Theme) => item.id, []);

  return (
    <ScreenContainer className="flex-1">
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          选择主题
        </Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          点击卡片设为默认主题，夸奖将根据主题风格生成
        </Text>
      </View>

      <FlatList
        data={THEMES}
        renderItem={renderThemeCard}
        keyExtractor={keyExtractor}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  row: {
    justifyContent: "space-between",
    gap: 12,
  },
  separator: {
    height: 12,
  },
});
