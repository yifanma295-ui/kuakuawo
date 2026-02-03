import React, { useState, useCallback, useMemo } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { SavedPraiseCard } from "@/components/saved-praise-card";
import { FilterTabs, FilterType } from "@/components/filter-tabs";
import { useApp } from "@/lib/app-context";
import { SavedPraise } from "@/lib/store";
import { useColors } from "@/hooks/use-colors";

export default function EchoScreen() {
  const colors = useColors();
  const { state, removePraise, incrementEchoCount } = useApp();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filteredPraises = useMemo(() => {
    if (activeFilter === "all") {
      return state.savedPraises;
    }
    return state.savedPraises.filter((p) => p.type === activeFilter);
  }, [state.savedPraises, activeFilter]);

  const handleDelete = useCallback(
    (id: string) => {
      removePraise(id);
    },
    [removePraise]
  );

  const handleShare = useCallback(() => {
    incrementEchoCount();
  }, [incrementEchoCount]);

  const renderPraiseCard = useCallback(
    ({ item }: { item: SavedPraise }) => (
      <SavedPraiseCard
        praise={item}
        onDelete={() => handleDelete(item.id)}
        onShare={handleShare}
      />
    ),
    [handleDelete, handleShare]
  );

  const keyExtractor = useCallback((item: SavedPraise) => item.id, []);

  const ListEmptyComponent = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>💝</Text>
        <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
          还没有收藏的夸奖
        </Text>
        <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
          去首页生成夸奖，点击收藏按钮保存到这里
        </Text>
      </View>
    ),
    [colors]
  );

  return (
    <ScreenContainer className="flex-1">
      {/* 页面标题 */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>Echo</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          与自己的共鸣，向世界的回响
        </Text>
      </View>

      {/* 统计区域 */}
      <View style={styles.statsContainer}>
        <View
          style={[
            styles.statCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.statNumber, { color: colors.primary }]}>
            {state.resonanceCount}
          </Text>
          <Text style={[styles.statLabel, { color: colors.muted }]}>
            共鸣数
          </Text>
          <Text style={[styles.statDesc, { color: colors.muted }]}>
            收藏的夸奖
          </Text>
        </View>
        <View
          style={[
            styles.statCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.statNumber, { color: colors.warning }]}>
            {state.echoCount}
          </Text>
          <Text style={[styles.statLabel, { color: colors.muted }]}>
            回响数
          </Text>
          <Text style={[styles.statDesc, { color: colors.muted }]}>
            分享的善意
          </Text>
        </View>
      </View>

      {/* 筛选标签 */}
      <FilterTabs
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* 收藏列表 */}
      <FlatList
        data={filteredPraises}
        renderItem={renderPraiseCard}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={ListEmptyComponent}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  statDesc: {
    fontSize: 12,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
