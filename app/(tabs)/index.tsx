import React, { useState, useCallback } from "react";
import {
  ScrollView,
  Text,
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Pressable } from "react-native";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { BreathingButton } from "@/components/breathing-button";
import { PraiseCard } from "@/components/praise-card";
import { useApp } from "@/lib/app-context";
import { getGreeting } from "@/lib/store";
import { useColors } from "@/hooks/use-colors";
import { generatePraise } from "@/lib/praise-generator";

export default function HomeScreen() {
  const colors = useColors();
  const { state, addPraise, incrementEchoCount, getDefaultTheme } = useApp();
  const [inputText, setInputText] = useState("");
  const [praises, setPraises] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePraise = useCallback(
    async (customInput?: string) => {
      if (isGenerating) return;
      setIsGenerating(true);

      try {
        const theme = getDefaultTheme();
        const input = customInput || inputText;
        const generatedPraises = await generatePraise(
          state.nickname,
          theme,
          input
        );
        setPraises(generatedPraises);
        if (input) {
          setInputText("");
        }
      } catch (error) {
        console.error("Generate praise error:", error);
      } finally {
        setIsGenerating(false);
      }
    },
    [isGenerating, inputText, state.nickname, getDefaultTheme]
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
    (content: string, type: "self" | "others" | "highlight") => {
      const theme = getDefaultTheme();
      addPraise({
        content,
        themeId: theme.id,
        type,
        input: inputText || undefined,
      });
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    },
    [addPraise, getDefaultTheme, inputText]
  );

  const handleSharePraise = useCallback(() => {
    incrementEchoCount();
  }, [incrementEchoCount]);

  const greeting = getGreeting();
  const defaultTheme = getDefaultTheme();

  return (
    <ScreenContainer className="flex-1">
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
            <Text style={[styles.nickname, { color: colors.foreground }]}>
              {state.nickname}
            </Text>
            <Text style={[styles.greeting, { color: colors.muted }]}>
              {greeting}
            </Text>
          </View>

          {/* 当前主题提示 */}
          <View style={styles.themeHint}>
            <Text style={[styles.themeHintText, { color: colors.muted }]}>
              当前主题: {defaultTheme.emoji} {defaultTheme.name}
            </Text>
          </View>

          {/* 中心呼吸按钮 */}
          <View style={styles.buttonContainer}>
            {isGenerating ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.muted }]}>
                  正在为你生成夸奖...
                </Text>
              </View>
            ) : (
              <BreathingButton
                onPress={handleButtonPress}
                disabled={isGenerating}
              />
            )}
          </View>

          {/* 输入区域 */}
          <View style={styles.inputContainer}>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="想因为什么被夸奖？"
                placeholderTextColor={colors.muted}
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
                  {
                    backgroundColor:
                      inputText.trim() && !isGenerating
                        ? colors.primary
                        : colors.border,
                  },
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Text
                  style={[
                    styles.generateButtonText,
                    {
                      color:
                        inputText.trim() && !isGenerating
                          ? "#FFFFFF"
                          : colors.muted,
                    },
                  ]}
                >
                  生成
                </Text>
              </Pressable>
            </View>
          </View>

          {/* 夸奖卡片列表 */}
          {praises.length > 0 && (
            <View style={styles.praiseList}>
              {praises.map((praise, index) => (
                <PraiseCard
                  key={`${praise}-${index}`}
                  content={praise}
                  index={index}
                  onSave={(type) => handleSavePraise(praise, type)}
                  onShare={handleSharePraise}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
  nickname: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  greeting: {
    fontSize: 16,
  },
  themeHint: {
    alignItems: "center",
    paddingVertical: 8,
  },
  themeHintText: {
    fontSize: 14,
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    minHeight: 280,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
  },
  inputContainer: {
    paddingBottom: 24,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  generateButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  praiseList: {
    gap: 12,
  },
});
