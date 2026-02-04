import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  ScrollView,
  Text,
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { Pressable } from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";

import { ScreenContainer } from "@/components/screen-container";
import { BreathingButton } from "@/components/breathing-button";
import { BreathingBackgroundV3 } from "@/components/breathing-background-v3";
import { TypewriterText } from "@/components/typewriter-text";
import { NicknameEditModal } from "@/components/nickname-edit-modal";
import { DebugResetButton } from "@/components/debug-reset-button";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ShareCard, generateShareCard } from "@/components/share-card";
import { useApp } from "@/lib/app-context";
import { getGreeting } from "@/lib/store";
import { generatePraise } from "@/lib/praise-generator";
import ViewShot from "react-native-view-shot";

export default function HomeScreen() {
  const { state, isLoading, setNickname, addPraise, addEchoPraise, themeChanged, resetThemeChanged, getDefaultTheme, getActualTheme } = useApp();
  const [inputText, setInputText] = useState("");
  const [currentPraise, setCurrentPraise] = useState<string | null>(null);
  const [currentInput, setCurrentInput] = useState<string | null>(null);
  const [currentThemeId, setCurrentThemeId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const shareCardRef = useRef<ViewShot>(null);

  // 检查是否需要显示 Onboarding
  useEffect(() => {
    console.log("[HomeScreen] isLoading:", isLoading);
    console.log("[HomeScreen] onboardingComplete:", state.onboardingComplete);
    console.log("[HomeScreen] Current nickname:", state.nickname);
    if (!isLoading && !state.onboardingComplete) {
      router.replace("/onboarding" as any);
    }
  }, [isLoading, state.onboardingComplete, state.nickname]);

  // 主题变化时重置首页状态（V4.0 需求）
  useEffect(() => {
    if (themeChanged) {
      setCurrentPraise(null);
      setCurrentInput(null);
      setCurrentThemeId(null);
      setShowActions(false);
      resetThemeChanged();
    }
  }, [themeChanged, resetThemeChanged]);

  const handleGeneratePraise = useCallback(
    async (customInput?: string) => {
      if (isGenerating) return;
      setIsGenerating(true);
      setShowActions(false);
      setCurrentPraise(null);

      try {
        const defaultTheme = getDefaultTheme();
        const actualTheme = getActualTheme(defaultTheme.id);
        const input = customInput || inputText;
        
        // 保存当前输入用于显示
        if (input) {
          setCurrentInput(input);
        } else {
          setCurrentInput(null);
        }
        
        setCurrentThemeId(actualTheme.id);
        
        const generatedPraises = await generatePraise(
          state.nickname,
          actualTheme,
          input
        );
        
        // 只展示一句最动人的话
        if (generatedPraises.length > 0) {
          setCurrentPraise(generatedPraises[0]);
        }
        
        if (input) {
          setInputText("");
        }
      } catch (error) {
        console.error("Generate praise error:", error);
      } finally {
        setIsGenerating(false);
      }
    },
    [isGenerating, inputText, state.nickname, getDefaultTheme, getActualTheme]
  );

  const handleButtonPress = useCallback(() => {
    handleGeneratePraise();
  }, [handleGeneratePraise]);

  const handleInputSubmit = useCallback(() => {
    if (inputText.trim()) {
      handleGeneratePraise(inputText.trim());
    }
  }, [inputText, handleGeneratePraise]);

  const handleSavePraise = useCallback(
    (type: "self" | "others" | "highlight") => {
      if (!currentPraise || !currentThemeId) return;
      
      addPraise({
        content: currentPraise,
        themeId: currentThemeId,
        type,
        input: currentInput || undefined,
      });
      
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    },
    [addPraise, currentPraise, currentThemeId, currentInput]
  );

  // 分享共鸣功能（V6.0 升级：生成分享卡片）
  const handleSharePraise = useCallback(async () => {
    if (!currentPraise || !currentThemeId || isGeneratingCard) return;
    
    setIsGeneratingCard(true);
    
    try {
      // 生成分享卡片
      const uri = await generateShareCard(
        currentPraise,
        Date.now(),
        shareCardRef
      );
      
      if (uri) {
        // 记录到 Echo 页面的回响分类
        addEchoPraise(currentPraise, currentThemeId);
        
        // 触发触感反馈
        if (Platform.OS !== "web") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        
        // 显示提示
        if (Platform.OS === "web") {
          Alert.alert("分享卡片已生成", "右键点击图片保存或分享 💕", [{ text: "好的" }]);
        } else {
          Alert.alert("分享卡片已生成", "已保存到相册，去分享给朋友吧 💕", [{ text: "好的" }]);
        }
      } else {
        Alert.alert("生成失败", "请重试");
      }
    } catch (error) {
      console.error("Generate share card error:", error);
      Alert.alert("生成失败", "请重试");
    } finally {
      setIsGeneratingCard(false);
    }
  }, [currentPraise, currentThemeId, addEchoPraise, isGeneratingCard]);

  const handleTypewriterComplete = useCallback(() => {
    setShowActions(true);
  }, []);

  const handleRefresh = useCallback(() => {
    handleGeneratePraise(currentInput || undefined);
  }, [handleGeneratePraise, currentInput]);

  // 如果还在加载或未完成 onboarding，显示加载状态
  if (isLoading || !state.onboardingComplete) {
    return (
      <View style={styles.loadingScreen}>
        <LinearGradient
          colors={["#FFF8E7", "#FFECD2", "#FFE4D6"]}
          style={StyleSheet.absoluteFillObject}
        />
        <ActivityIndicator size="large" color="#FF8A80" />
      </View>
    );
  }

  const greeting = getGreeting();
  const defaultTheme = getDefaultTheme();

  return (
    <View style={styles.container}>
      {/* 呼吸感渐变背景 */}
      <BreathingBackgroundV3 />
      
      <ScreenContainer className="flex-1" containerClassName="bg-transparent">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* 顶部问候区域 */}
            <View style={styles.header}>
              <View style={styles.nicknameRow}>
                <Text style={styles.nickname}>{state.nickname}</Text>
                <Pressable
                  onPress={() => setShowNicknameModal(true)}
                  style={({ pressed }) => [
                    styles.editIcon,
                    pressed && { opacity: 0.6 },
                  ]}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <IconSymbol name="pencil" size={16} color="#8B5A2B" />
                </Pressable>
                <DebugResetButton visible={true} />
              </View>
              <Text style={styles.greeting}>{greeting}</Text>
            </View>

            {/* 当前主题提示 */}
            <View style={styles.themeHint}>
              <Text style={styles.themeHintText}>
                当前主题: {defaultTheme.emoji} {defaultTheme.name}
              </Text>
            </View>

            {/* 中心呼吸按钮或夸奖展示 */}
            <View style={styles.mainContent}>
              {isGenerating ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#FF8A80" />
                  <Text style={styles.loadingText}>正在为你生成夸奖...</Text>
                </View>
              ) : currentPraise ? (
                <Animated.View
                  entering={FadeIn.duration(500)}
                  style={styles.praiseContainer}
                >
                  {/* 用户输入回顾 */}
                  {currentInput && (
                    <Animated.View
                      entering={FadeInUp.duration(400).delay(100)}
                      style={styles.inputReview}
                    >
                      <Text style={styles.inputReviewLabel}>因为：</Text>
                      <Text style={styles.inputReviewText}>{currentInput}</Text>
                    </Animated.View>
                  )}
                  
                  {/* 夸奖内容 - 打字机效果 */}
                  <View style={styles.praiseContent}>
                    <TypewriterText
                      text={currentPraise}
                      speed={50}
                      onComplete={handleTypewriterComplete}
                      style={styles.praiseText}
                    />
                  </View>

                  {/* 操作按钮 */}
                  {showActions && (
                    <Animated.View
                      entering={FadeInUp.duration(400)}
                      style={styles.actionButtons}
                    >
                      <View style={styles.actionRow}>
                        <Pressable
                          onPress={() => handleSavePraise(currentInput ? "highlight" : "self")}
                          style={({ pressed }) => [
                            styles.actionButton,
                            styles.saveButton,
                            pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] },
                          ]}
                        >
                          <Text style={styles.saveButtonText}>
                            💝 收藏高光
                          </Text>
                        </Pressable>
                        
                        <Pressable
                          onPress={handleSharePraise}
                          disabled={isGeneratingCard}
                          style={({ pressed }) => [
                            styles.actionButton,
                            styles.shareButton,
                            pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] },
                            isGeneratingCard && { opacity: 0.5 },
                          ]}
                        >
                          <Text style={styles.shareButtonText}>
                            {isGeneratingCard ? "生成中..." : "📤 分享共鸣"}
                          </Text>
                        </Pressable>
                      </View>
                      
                      <Pressable
                        onPress={handleRefresh}
                        style={({ pressed }) => [
                          styles.actionButton,
                          styles.refreshButton,
                          pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] },
                        ]}
                      >
                        <Text style={styles.refreshButtonText}>🔄 换一句</Text>
                      </Pressable>
                    </Animated.View>
                  )}
                </Animated.View>
              ) : (
                <BreathingButton
                  onPress={handleButtonPress}
                  disabled={isGenerating}
                />
              )}
            </View>

            {/* 输入区域 */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="想因为什么被夸奖？"
                  placeholderTextColor="rgba(139, 90, 43, 0.4)"
                  value={inputText}
                  onChangeText={setInputText}
                  returnKeyType="done"
                  onSubmitEditing={handleInputSubmit}
                  editable={!isGenerating}
                />
                <Pressable
                  onPress={handleInputSubmit}
                  disabled={!inputText.trim() || isGenerating}
                  style={({ pressed }) => [
                    styles.generateButton,
                    inputText.trim() && !isGenerating
                      ? styles.generateButtonActive
                      : styles.generateButtonDisabled,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text
                    style={[
                      styles.generateButtonText,
                      inputText.trim() && !isGenerating
                        ? styles.generateButtonTextActive
                        : styles.generateButtonTextDisabled,
                    ]}
                  >
                    生成
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ScreenContainer>
      
      <NicknameEditModal
        visible={showNicknameModal}
        currentNickname={state.nickname}
        onClose={() => setShowNicknameModal(false)}
        onSave={setNickname}
      />
      
      {/* 隐藏的分享卡片组件（用于生成图片） */}
      {currentPraise && (
        <View style={{ position: "absolute", left: -9999, top: -9999 }}>
          <ShareCard
            ref={shareCardRef}
            content={currentPraise}
            timestamp={Date.now()}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  header: {
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 8,
  },
  nicknameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  editIcon: {
    padding: 4,
  },
  nickname: {
    fontSize: 28,
    fontWeight: "700",
    color: "#5D4037",
    marginBottom: 4,
    fontFamily: "LXGWWenKai",
  },
  greeting: {
    fontSize: 16,
    color: "#8B5A2B",
    fontFamily: "LXGWWenKai",
  },
  themeHint: {
    alignItems: "center",
    paddingVertical: 8,
  },
  themeHintText: {
    fontSize: 14,
    color: "#8B5A2B",
    opacity: 0.7,
    fontFamily: "LXGWWenKai",
  },
  mainContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    minHeight: 300,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#8B5A2B",
    fontFamily: "LXGWWenKai",
  },
  praiseContainer: {
    width: "100%",
    alignItems: "center",
  },
  inputReview: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 20,
    maxWidth: "90%",
  },
  inputReviewLabel: {
    fontSize: 14,
    color: "#8B5A2B",
    opacity: 0.7,
    fontFamily: "LXGWWenKai",
  },
  inputReviewText: {
    fontSize: 14,
    color: "#5D4037",
    flex: 1,
    fontFamily: "LXGWWenKai",
  },
  praiseContent: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    maxWidth: "100%",
    // 磨砂玻璃效果
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  praiseText: {
    fontSize: 18,
    lineHeight: 32,
    color: "#5D4037",
    textAlign: "center",
    fontFamily: "LXGWWenKai",
  },
  actionButtons: {
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  saveButton: {
    backgroundColor: "#FF8A80",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "LXGWWenKai",
  },
  shareButton: {
    backgroundColor: "#87CEEB",
  },
  shareButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "LXGWWenKai",
  },
  refreshButton: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderWidth: 1,
    borderColor: "rgba(255, 138, 128, 0.3)",
  },
  refreshButtonText: {
    color: "#5D4037",
    fontSize: 15,
    fontFamily: "LXGWWenKai",
  },
  inputContainer: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 138, 128, 0.2)",
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    color: "#5D4037",
    fontFamily: "LXGWWenKai",
  },
  generateButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  generateButtonActive: {
    backgroundColor: "#FF8A80",
  },
  generateButtonDisabled: {
    backgroundColor: "rgba(139, 90, 43, 0.1)",
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "LXGWWenKai",
  },
  generateButtonTextActive: {
    color: "#FFFFFF",
  },
  generateButtonTextDisabled: {
    color: "rgba(139, 90, 43, 0.4)",
  },
});
