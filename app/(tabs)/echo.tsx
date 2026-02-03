import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Text, View, StyleSheet, FlatList, Pressable, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { SavedPraiseCard } from "@/components/saved-praise-card";
import { useApp } from "@/lib/app-context";
import { SavedPraise } from "@/lib/store";
import { trackPageView } from "@/lib/analytics";

type FilterType = "resonance" | "echo";

export default function EchoScreen() {
  const { state, removePraise, incrementEchoCount } = useApp();
  const [activeFilter, setActiveFilter] = useState<FilterType>("resonance");

  // 记录页面访问
  useEffect(() => {
    trackPageView("/echo").catch(console.warn);
  }, []);

  // 共鸣：致自己 + 高光时刻
  const resonancePraises = useMemo(() => {
    return state.savedPraises.filter((p) => p.type === "self" || p.type === "highlight");
  }, [state.savedPraises]);

  // 回响：予他人
  const echoPraises = useMemo(() => {
    return state.savedPraises.filter((p) => p.type === "others");
  }, [state.savedPraises]);

  const filteredPraises = useMemo(() => {
    return activeFilter === "resonance" ? resonancePraises : echoPraises;
  }, [activeFilter, resonancePraises, echoPraises]);

  const handleDelete = useCallback(
    (id: string) => {
      removePraise(id);
    },
    [removePraise]
  );

  const handleShare = useCallback(() => {
    incrementEchoCount();
  }, [incrementEchoCount]);

  const handleFilterChange = useCallback((filter: FilterType) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setActiveFilter(filter);
  }, []);

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
        <Text style={styles.emptyEmoji}>
          {activeFilter === "resonance" ? "💝" : "🌟"}
        </Text>
        <Text style={styles.emptyTitle}>
          {activeFilter === "resonance" ? "还没有收藏的夸奖" : "还没有分享过夸奖"}
        </Text>
        <Text style={styles.emptySubtitle}>
          {activeFilter === "resonance"
            ? "去首页生成夸奖，点击收藏按钮保存到这里"
            : "把温暖的话语分享给身边的人吧"}
        </Text>
      </View>
    ),
    [activeFilter]
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#FFF8E7", "#FFECD2", "#FFE4D6", "#FFD8CC"]}
        locations={[0, 0.3, 0.7, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      
      <ScreenContainer className="flex-1" containerClassName="bg-transparent">
        {/* 页面标题 */}
        <View style={styles.header}>
          <Text style={styles.nickname}>{state.nickname}</Text>
          <Text style={styles.title}>Echo</Text>
          <Text style={styles.subtitle}>与自己的共鸣，向世界的回响</Text>
        </View>

        {/* 统计区域 - 两个维度 */}
        <View style={styles.statsContainer}>
          <Pressable
            onPress={() => handleFilterChange("resonance")}
            style={({ pressed }) => [
              styles.statCard,
              activeFilter === "resonance" && styles.statCardActive,
              pressed && { opacity: 0.8 },
            ]}
          >
            {activeFilter === "resonance" && (
              <LinearGradient
                colors={["#FF9A8B", "#FF8A80"]}
                style={StyleSheet.absoluteFillObject}
              />
            )}
            <Text style={[
              styles.statNumber,
              activeFilter === "resonance" ? styles.statNumberActive : styles.statNumberInactive
            ]}>
              {state.resonanceCount}
            </Text>
            <Text style={[
              styles.statLabel,
              activeFilter === "resonance" ? styles.statLabelActive : styles.statLabelInactive
            ]}>
              共鸣
            </Text>
            <Text style={[
              styles.statDesc,
              activeFilter === "resonance" ? styles.statDescActive : styles.statDescInactive
            ]}>
              致自己的温柔
            </Text>
          </Pressable>
          
          <Pressable
            onPress={() => handleFilterChange("echo")}
            style={({ pressed }) => [
              styles.statCard,
              activeFilter === "echo" && styles.statCardActive,
              pressed && { opacity: 0.8 },
            ]}
          >
            {activeFilter === "echo" && (
              <LinearGradient
                colors={["#FFB74D", "#FFA726"]}
                style={StyleSheet.absoluteFillObject}
              />
            )}
            <Text style={[
              styles.statNumber,
              activeFilter === "echo" ? styles.statNumberActive : styles.statNumberInactive
            ]}>
              {state.echoCount}
            </Text>
            <Text style={[
              styles.statLabel,
              activeFilter === "echo" ? styles.statLabelActive : styles.statLabelInactive
            ]}>
              回响
            </Text>
            <Text style={[
              styles.statDesc,
              activeFilter === "echo" ? styles.statDescActive : styles.statDescInactive
            ]}>
              予他人的善意
            </Text>
          </Pressable>
        </View>

        {/* 激励文案 */}
        <View style={styles.motivationContainer}>
          <Text style={styles.motivationText}>
            {state.nickname}，你知道吗？愿意温柔地对自己说话，本身就是一种了不起的力量。
          </Text>
        </View>

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
    paddingBottom: 8,
    alignItems: "center",
  },
  nickname: {
    fontSize: 14,
    color: "#8B5A2B",
    opacity: 0.7,
    marginBottom: 4,
    fontFamily: "LXGWWenKai",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#5D4037",
    marginBottom: 4,
    fontFamily: "LXGWWenKai",
  },
  subtitle: {
    fontSize: 15,
    color: "#8B5A2B",
    fontFamily: "LXGWWenKai",
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
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(255, 138, 128, 0.2)",
    overflow: "hidden",
  },
  statCardActive: {
    borderColor: "transparent",
    shadowColor: "#FF8A80",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 4,
    fontFamily: "LXGWWenKai",
  },
  statNumberActive: {
    color: "#FFFFFF",
  },
  statNumberInactive: {
    color: "#FF8A80",
  },
  statLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
    fontFamily: "LXGWWenKai",
  },
  statLabelActive: {
    color: "#FFFFFF",
  },
  statLabelInactive: {
    color: "#5D4037",
  },
  statDesc: {
    fontSize: 12,
    fontFamily: "LXGWWenKai",
  },
  statDescActive: {
    color: "rgba(255, 255, 255, 0.85)",
  },
  statDescInactive: {
    color: "#8B5A2B",
  },
  motivationContainer: {
    paddingHorizontal: 32,
    paddingBottom: 16,
  },
  motivationText: {
    fontSize: 13,
    color: "#8B5A2B",
    opacity: 0.6,
    textAlign: "center",
    lineHeight: 20,
    fontFamily: "LXGWWenKai",
    fontStyle: "italic",
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
    color: "#5D4037",
    marginBottom: 8,
    fontFamily: "LXGWWenKai",
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    color: "#8B5A2B",
    fontFamily: "LXGWWenKai",
  },
});
