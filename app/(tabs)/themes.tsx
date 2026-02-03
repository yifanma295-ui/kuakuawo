import React, { useCallback, useEffect } from "react";
import { Text, View, StyleSheet, FlatList, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

import { ScreenContainer } from "@/components/screen-container";
import { ThemeCard } from "@/components/theme-card";
import { useApp } from "@/lib/app-context";
import { THEMES, Theme } from "@/lib/store";
import { trackThemeClick, trackPageView } from "@/lib/analytics";

export default function ThemesScreen() {
  const { state, setDefaultTheme } = useApp();

  // 记录页面访问
  useEffect(() => {
    trackPageView("/themes");
  }, []);

  const handleSelectTheme = useCallback(
    (theme: Theme) => {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      setDefaultTheme(theme.id);
      // 埋点：记录主题点击
      trackThemeClick(theme.id, theme.name);
    },
    [setDefaultTheme]
  );

  const renderThemeCard = useCallback(
    ({ item }: { item: Theme }) => (
      <ThemeCard
        theme={item}
        isSelected={state.defaultThemeId === item.id}
        onPress={() => handleSelectTheme(item)}
      />
    ),
    [state.defaultThemeId, handleSelectTheme]
  );

  const keyExtractor = useCallback((item: Theme) => item.id, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#FFF8E7", "#FFECD2", "#FFE4D6", "#FFD8CC"]}
        locations={[0, 0.3, 0.7, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      
      <ScreenContainer className="flex-1" containerClassName="bg-transparent">
        <View style={styles.header}>
          <Text style={styles.title}>选择主题</Text>
          <Text style={styles.subtitle}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#5D4037",
    marginBottom: 8,
    fontFamily: "LXGWWenKai",
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#8B5A2B",
    fontFamily: "LXGWWenKai",
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
