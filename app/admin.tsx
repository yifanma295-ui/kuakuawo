import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Platform,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";

interface StatsData {
  uv: number;
  pv: number;
  nicknames: Array<{
    id: number;
    visitorId: string;
    nickname: string;
    createdAt: Date;
  }>;
  praiseRecords: Array<{
    id: number;
    visitorId: string;
    nickname: string | null;
    userInput: string | null;
    themeId: string;
    themeName: string;
    generatedPraise: string;
    isSaved: boolean;
    saveType: string | null;
    createdAt: Date;
  }>;
  themeStats: Array<{
    themeId: string;
    themeName: string;
    clickCount: number;
  }>;
  themeClicks: Array<{
    id: number;
    visitorId: string;
    themeId: string;
    themeName: string;
    createdAt: Date;
  }>;
}

export default function AdminScreen() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "nicknames" | "praises" | "themes">("overview");

  const loginMutation = trpc.admin.login.useMutation();

  const handleLogin = async () => {
    if (!password.trim()) {
      setError("请输入密码");
      return;
    }
    
    try {
      const result = await loginMutation.mutateAsync({ password });
      if (result.success) {
        setIsLoggedIn(true);
        setError("");
        fetchStats();
      } else {
        setError("密码错误");
      }
    } catch (err) {
      setError("登录失败，请重试");
    }
  };

  const fetchStats = useCallback(async () => {
    if (!password) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/trpc/admin.getStats?input=${encodeURIComponent(JSON.stringify({ password }))}`);
      const data = await response.json();
      
      if (data.result?.data?.success) {
        setStats(data.result.data.data);
      } else {
        setError("获取数据失败");
      }
    } catch (err) {
      console.error("Fetch stats error:", err);
      setError("获取数据失败");
    } finally {
      setLoading(false);
    }
  }, [password]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchStats();
    }
  }, [isLoggedIn, fetchStats]);

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 登录页面
  if (!isLoggedIn) {
    return (
      <ScreenContainer className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center p-6">
          <Text className="text-2xl font-bold text-gray-800 mb-2">🔐 管理后台</Text>
          <Text className="text-gray-500 mb-8">请输入管理员密码</Text>
          
          <TextInput
            className="w-full max-w-xs bg-gray-100 rounded-xl px-4 py-3 text-base mb-4"
            placeholder="输入密码"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={handleLogin}
            returnKeyType="done"
          />
          
          {error ? (
            <Text className="text-red-500 mb-4">{error}</Text>
          ) : null}
          
          <TouchableOpacity
            className="bg-orange-400 px-8 py-3 rounded-full"
            onPress={handleLogin}
            style={{ opacity: loginMutation.isPending ? 0.7 : 1 }}
          >
            <Text className="text-white font-semibold text-base">
              {loginMutation.isPending ? "登录中..." : "登录"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  // 数据展示页面
  return (
    <ScreenContainer className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchStats} />
        }
      >
        {/* 头部 */}
        <View className="bg-white p-4 border-b border-gray-200">
          <Text className="text-xl font-bold text-gray-800">📊 夸夸我 - 数据后台</Text>
          <Text className="text-gray-500 text-sm mt-1">下拉刷新获取最新数据</Text>
        </View>

        {/* 概览卡片 */}
        <View className="flex-row p-4 gap-4">
          <View className="flex-1 bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-gray-500 text-sm">独立访客 (UV)</Text>
            <Text className="text-3xl font-bold text-orange-500 mt-1">
              {stats?.uv || 0}
            </Text>
          </View>
          <View className="flex-1 bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-gray-500 text-sm">总访问次数 (PV)</Text>
            <Text className="text-3xl font-bold text-blue-500 mt-1">
              {stats?.pv || 0}
            </Text>
          </View>
        </View>

        {/* Tab 切换 */}
        <View className="flex-row bg-white mx-4 rounded-xl overflow-hidden">
          {[
            { key: "overview", label: "概览" },
            { key: "nicknames", label: "昵称" },
            { key: "praises", label: "夸奖" },
            { key: "themes", label: "主题" },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              className={`flex-1 py-3 ${activeTab === tab.key ? "bg-orange-400" : ""}`}
              onPress={() => setActiveTab(tab.key as typeof activeTab)}
            >
              <Text
                className={`text-center font-medium ${
                  activeTab === tab.key ? "text-white" : "text-gray-600"
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 内容区域 */}
        <View className="p-4">
          {activeTab === "overview" && (
            <View className="bg-white rounded-xl p-4">
              <Text className="text-lg font-semibold text-gray-800 mb-4">📈 数据概览</Text>
              
              <View className="mb-4">
                <Text className="text-gray-600 mb-2">主题点击排行</Text>
                {stats?.themeStats?.map((theme, index) => (
                  <View key={theme.themeId} className="flex-row justify-between py-2 border-b border-gray-100">
                    <Text className="text-gray-700">
                      {index + 1}. {theme.themeName}
                    </Text>
                    <Text className="text-orange-500 font-medium">{theme.clickCount} 次</Text>
                  </View>
                ))}
                {(!stats?.themeStats || stats.themeStats.length === 0) && (
                  <Text className="text-gray-400 text-center py-4">暂无数据</Text>
                )}
              </View>
              
              <View>
                <Text className="text-gray-600 mb-2">统计摘要</Text>
                <Text className="text-gray-500">• 用户昵称记录: {stats?.nicknames?.length || 0} 条</Text>
                <Text className="text-gray-500">• 夸奖生成记录: {stats?.praiseRecords?.length || 0} 条</Text>
                <Text className="text-gray-500">• 已收藏夸奖: {stats?.praiseRecords?.filter(p => p.isSaved).length || 0} 条</Text>
              </View>
            </View>
          )}

          {activeTab === "nicknames" && (
            <View className="bg-white rounded-xl p-4">
              <Text className="text-lg font-semibold text-gray-800 mb-4">👤 用户昵称记录</Text>
              {stats?.nicknames?.map((item) => (
                <View key={item.id} className="py-3 border-b border-gray-100">
                  <Text className="text-gray-800 font-medium">{item.nickname}</Text>
                  <Text className="text-gray-400 text-xs mt-1">
                    {formatDate(item.createdAt)} · {item.visitorId.slice(0, 8)}...
                  </Text>
                </View>
              ))}
              {(!stats?.nicknames || stats.nicknames.length === 0) && (
                <Text className="text-gray-400 text-center py-8">暂无昵称记录</Text>
              )}
            </View>
          )}

          {activeTab === "praises" && (
            <View className="bg-white rounded-xl p-4">
              <Text className="text-lg font-semibold text-gray-800 mb-4">✨ 夸奖生成记录</Text>
              {stats?.praiseRecords?.map((item) => (
                <View key={item.id} className="py-3 border-b border-gray-100">
                  <View className="flex-row items-center mb-1">
                    <Text className="text-orange-500 text-xs bg-orange-50 px-2 py-0.5 rounded">
                      {item.themeName}
                    </Text>
                    {item.isSaved && (
                      <Text className="text-green-500 text-xs bg-green-50 px-2 py-0.5 rounded ml-2">
                        已收藏
                      </Text>
                    )}
                  </View>
                  {item.userInput && (
                    <Text className="text-gray-500 text-sm mb-1">
                      用户输入: {item.userInput}
                    </Text>
                  )}
                  <Text className="text-gray-800">{item.generatedPraise}</Text>
                  <Text className="text-gray-400 text-xs mt-1">
                    {item.nickname || "匿名"} · {formatDate(item.createdAt)}
                  </Text>
                </View>
              ))}
              {(!stats?.praiseRecords || stats.praiseRecords.length === 0) && (
                <Text className="text-gray-400 text-center py-8">暂无夸奖记录</Text>
              )}
            </View>
          )}

          {activeTab === "themes" && (
            <View className="bg-white rounded-xl p-4">
              <Text className="text-lg font-semibold text-gray-800 mb-4">🎯 主题点击记录</Text>
              {stats?.themeClicks?.map((item) => (
                <View key={item.id} className="py-3 border-b border-gray-100">
                  <Text className="text-gray-800">{item.themeName}</Text>
                  <Text className="text-gray-400 text-xs mt-1">
                    {formatDate(item.createdAt)} · {item.visitorId.slice(0, 8)}...
                  </Text>
                </View>
              ))}
              {(!stats?.themeClicks || stats.themeClicks.length === 0) && (
                <Text className="text-gray-400 text-center py-8">暂无主题点击记录</Text>
              )}
            </View>
          )}
        </View>

        {/* 底部间距 */}
        <View className="h-20" />
      </ScrollView>
    </ScreenContainer>
  );
}
