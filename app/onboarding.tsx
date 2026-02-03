import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Pressable } from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/lib/app-context";

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { setNickname, setOnboardingComplete } = useApp();
  const [name, setName] = useState("");

  const handleContinue = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    const finalName = name.trim() || "朋友";
    setNickname(finalName);
    setOnboardingComplete(true);
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#FFF8E7", "#FFECD2", "#FFE4D6"]}
        style={StyleSheet.absoluteFillObject}
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
          {/* 欢迎文字 */}
          <Animated.View
            entering={FadeInDown.duration(800).delay(200)}
            style={styles.header}
          >
            <Text style={styles.emoji}>🌸</Text>
            <Text style={styles.title}>欢迎来到夸夸我</Text>
            <Text style={styles.subtitle}>
              这里是属于你的温暖角落
            </Text>
          </Animated.View>

          {/* 昵称输入 */}
          <Animated.View
            entering={FadeInUp.duration(800).delay(600)}
            style={styles.inputSection}
          >
            <Text style={styles.question}>我该怎么称呼你呢？</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="输入你的昵称"
                placeholderTextColor="rgba(139, 90, 43, 0.4)"
                maxLength={20}
                returnKeyType="done"
                onSubmitEditing={handleContinue}
              />
            </View>
            <Text style={styles.hint}>
              不填写的话，我就叫你"朋友"啦 ✨
            </Text>
          </Animated.View>

          {/* 继续按钮 */}
          <Animated.View
            entering={FadeIn.duration(600).delay(1000)}
            style={styles.buttonContainer}
          >
            <Pressable
              onPress={handleContinue}
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
            >
              <LinearGradient
                colors={["#FF9A8B", "#FF8A80"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>开始我的夸夸之旅</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#5D4037",
    marginBottom: 8,
    fontFamily: "LXGWWenKai",
  },
  subtitle: {
    fontSize: 16,
    color: "#8B5A2B",
    opacity: 0.8,
    fontFamily: "LXGWWenKai",
  },
  inputSection: {
    marginBottom: 48,
  },
  question: {
    fontSize: 20,
    color: "#5D4037",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "LXGWWenKai",
  },
  inputContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 138, 128, 0.3)",
    overflow: "hidden",
  },
  input: {
    fontSize: 18,
    color: "#5D4037",
    paddingHorizontal: 20,
    paddingVertical: 16,
    textAlign: "center",
    fontFamily: "LXGWWenKai",
  },
  hint: {
    fontSize: 14,
    color: "#8B5A2B",
    opacity: 0.6,
    textAlign: "center",
    marginTop: 12,
    fontFamily: "LXGWWenKai",
  },
  buttonContainer: {
    alignItems: "center",
  },
  button: {
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#FF8A80",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  buttonGradient: {
    paddingHorizontal: 36,
    paddingVertical: 16,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "LXGWWenKai",
  },
});
