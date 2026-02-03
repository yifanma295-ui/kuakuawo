import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";

type TabType = "overview" | "nicknames" | "praises" | "themes";

export default function AdminSecretScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [refreshing, setRefreshing] = useState(false);

  // API 查询
  const trafficQuery = trpc.admin.getTrafficStats.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const nicknamesQuery = trpc.admin.getNicknames.useQuery(
    { limit: 200 },
    { enabled: isAuthenticated }
  );
  const praisesQuery = trpc.admin.getPraiseRecords.useQuery(
    { limit: 200 },
    { enabled: isAuthenticated }
  );
  const themeStatsQuery = trpc.admin.getThemeStats.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const savedCountQuery = trpc.admin.getSavedCount.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const loginMutation = trpc.admin.login.useMutation();

  const handleLogin = async () => {
    if (!password.trim()) {
      setLoginError("请输入密码");
      return;
    }

    try {
      const result = await loginMutation.mutateAsync({ password: password.trim() });
      if (result.success) {
        setIsAuthenticated(true);
        setLoginError("");
      } else {
        setLoginError(result.error || "密码错误");
      }
    } catch (error) {
      setLoginError("登录失败，请重试");
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      trafficQuery.refetch(),
      nicknamesQuery.refetch(),
      praisesQuery.refetch(),
      themeStatsQuery.refetch(),
      savedCountQuery.refetch(),
    ]);
    setRefreshing(false);
  }, [trafficQuery, nicknamesQuery, praisesQuery, themeStatsQuery, savedCountQuery]);

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  // 登录页面
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={["#1a1a2e", "#16213e", "#0f3460"]}
          style={StyleSheet.absoluteFillObject}
        />
        <ScreenContainer className="flex-1" containerClassName="bg-transparent">
          <View style={styles.loginContainer}>
            <Text style={styles.loginTitle}>🔐 管理后台</Text>
            <Text style={styles.loginSubtitle}>请输入管理员密码</Text>

            <TextInput
              style={styles.passwordInput}
              placeholder="输入密码"
              placeholderTextColor="#666"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              onSubmitEditing={handleLogin}
              returnKeyType="done"
            />

            {loginError ? (
              <Text style={styles.errorText}>{loginError}</Text>
            ) : null}

            <Pressable
              onPress={handleLogin}
              style={({ pressed }) => [
                styles.loginButton,
                pressed && { opacity: 0.8 },
              ]}
            >
              {loginMutation.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>登录</Text>
              )}
            </Pressable>
          </View>
        </ScreenContainer>
      </View>
    );
  }

  // 管理后台主页面
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1a1a2e", "#16213e", "#0f3460"]}
        style={StyleSheet.absoluteFillObject}
      />
      <ScreenContainer className="flex-1" containerClassName="bg-transparent">
        {/* 标题 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📊 夸夸我 数据后台</Text>
          <Pressable onPress={handleRefresh} style={styles.refreshButton}>
            <Text style={styles.refreshText}>🔄 刷新</Text>
          </Pressable>
        </View>

        {/* Tab 切换 */}
        <View style={styles.tabContainer}>
          {(["overview", "nicknames", "praises", "themes"] as TabType[]).map(
            (tab) => (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[
                  styles.tab,
                  activeTab === tab && styles.tabActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.tabTextActive,
                  ]}
                >
                  {tab === "overview" && "概览"}
                  {tab === "nicknames" && "昵称"}
                  {tab === "praises" && "夸奖"}
                  {tab === "themes" && "主题"}
                </Text>
              </Pressable>
            )
          )}
        </View>

        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {/* 概览 Tab */}
          {activeTab === "overview" && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>流量统计</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>
                    {trafficQuery.data?.total.uv || 0}
                  </Text>
                  <Text style={styles.statLabel}>总 UV</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>
                    {trafficQuery.data?.total.pv || 0}
                  </Text>
                  <Text style={styles.statLabel}>总 PV</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>
                    {trafficQuery.data?.today.uv || 0}
                  </Text>
                  <Text style={styles.statLabel}>今日 UV</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>
                    {trafficQuery.data?.today.pv || 0}
                  </Text>
                  <Text style={styles.statLabel}>今日 PV</Text>
                </View>
              </View>

              <Text style={styles.sectionTitle}>内容统计</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>
                    {nicknamesQuery.data?.length || 0}
                  </Text>
                  <Text style={styles.statLabel}>昵称数</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>
                    {praisesQuery.data?.length || 0}
                  </Text>
                  <Text style={styles.statLabel}>夸奖数</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>
                    {savedCountQuery.data || 0}
                  </Text>
                  <Text style={styles.statLabel}>收藏数</Text>
                </View>
              </View>
            </View>
          )}

          {/* 昵称 Tab */}
          {activeTab === "nicknames" && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                用户昵称 ({nicknamesQuery.data?.length || 0})
              </Text>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableCell, styles.tableCellHeader, { flex: 2 }]}>
                    昵称
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellHeader, { flex: 1 }]}>
                    时间
                  </Text>
                </View>
                {nicknamesQuery.data?.map((item, index) => (
                  <View key={item.id} style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 2 }]}>
                      {item.nickname}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>
                      {formatDate(item.createdAt)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* 夸奖 Tab */}
          {activeTab === "praises" && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                夸奖记录 ({praisesQuery.data?.length || 0})
              </Text>
              {praisesQuery.data?.map((item) => (
                <View key={item.id} style={styles.praiseCard}>
                  <View style={styles.praiseHeader}>
                    <Text style={styles.praiseNickname}>{item.nickname}</Text>
                    <Text style={styles.praiseTheme}>{item.themeName}</Text>
                    {item.isSaved && (
                      <Text style={styles.praiseSaved}>❤️ {item.saveType}</Text>
                    )}
                  </View>
                  {item.userInput && (
                    <Text style={styles.praiseInput}>
                      输入: {item.userInput}
                    </Text>
                  )}
                  <Text style={styles.praiseContent}>{item.generatedPraise}</Text>
                  <Text style={styles.praiseTime}>
                    {formatDate(item.createdAt)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* 主题 Tab */}
          {activeTab === "themes" && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>主题点击统计</Text>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableCell, styles.tableCellHeader, { flex: 2 }]}>
                    主题
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellHeader, { flex: 1 }]}>
                    点击数
                  </Text>
                </View>
                {themeStatsQuery.data?.map((item, index) => (
                  <View key={item.themeId} style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 2 }]}>
                      {item.themeName || item.themeId}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>
                      {item.count}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={{ height: 50 }} />
        </ScrollView>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loginTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 16,
    color: "#aaa",
    marginBottom: 32,
  },
  passwordInput: {
    width: "100%",
    maxWidth: 300,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#fff",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 14,
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: "#4a90d9",
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 120,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  refreshButton: {
    padding: 8,
  },
  refreshText: {
    color: "#4a90d9",
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  tabActive: {
    backgroundColor: "#4a90d9",
  },
  tabText: {
    color: "#aaa",
    fontSize: 14,
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 16,
    minWidth: 80,
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#4a90d9",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#aaa",
  },
  table: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  tableCell: {
    color: "#ddd",
    fontSize: 14,
  },
  tableCellHeader: {
    color: "#fff",
    fontWeight: "600",
  },
  praiseCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  praiseHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  praiseNickname: {
    color: "#4a90d9",
    fontSize: 14,
    fontWeight: "600",
  },
  praiseTheme: {
    color: "#aaa",
    fontSize: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  praiseSaved: {
    color: "#ff6b6b",
    fontSize: 12,
  },
  praiseInput: {
    color: "#888",
    fontSize: 13,
    fontStyle: "italic",
    marginBottom: 8,
  },
  praiseContent: {
    color: "#ddd",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 8,
  },
  praiseTime: {
    color: "#666",
    fontSize: 12,
    textAlign: "right",
  },
});
