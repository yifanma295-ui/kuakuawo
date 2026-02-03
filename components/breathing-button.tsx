import React, { useEffect } from "react";
import { Text, StyleSheet, Platform } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/use-colors";

interface BreathingButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export function BreathingButton({ onPress, disabled }: BreathingButtonProps) {
  const colors = useColors();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const rippleScale = useSharedValue(0);
  const rippleOpacity = useSharedValue(0);

  // 呼吸动画
  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.97, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // 无限循环
      true
    );
  }, [scale]);

  const triggerHaptic = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handlePress = () => {
    onPress();
  };

  const tap = Gesture.Tap()
    .enabled(!disabled)
    .runOnJS(true)
    .onStart(() => {
      // 点击时的缩放反馈
      scale.value = withTiming(0.95, { duration: 80 });
      opacity.value = withTiming(0.9, { duration: 80 });
      
      // 水波纹动画
      rippleScale.value = 0;
      rippleOpacity.value = 0.6;
      rippleScale.value = withTiming(1.5, { duration: 600, easing: Easing.out(Easing.ease) });
      rippleOpacity.value = withTiming(0, { duration: 600 });
      
      triggerHaptic();
    })
    .onEnd(() => {
      // 恢复呼吸动画
      scale.value = withSequence(
        withTiming(1, { duration: 150 }),
        withRepeat(
          withSequence(
            withTiming(1.03, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
            withTiming(0.97, { duration: 1500, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        )
      );
      opacity.value = withTiming(1, { duration: 150 });
      handlePress();
    });

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const animatedRippleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rippleScale.value }],
    opacity: rippleOpacity.value,
  }));

  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={[styles.container]}>
        {/* 水波纹效果 */}
        <Animated.View
          style={[
            styles.ripple,
            { backgroundColor: colors.primary },
            animatedRippleStyle,
          ]}
        />
        {/* 主按钮 */}
        <Animated.View
          style={[
            styles.button,
            {
              backgroundColor: colors.primary,
              shadowColor: colors.primary,
            },
            animatedButtonStyle,
          ]}
        >
          <Text style={[styles.buttonText, { color: "#FFFFFF" }]}>
            今天，也夸夸自己吧
          </Text>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: 220,
    height: 220,
  },
  ripple: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
  },
  button: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 26,
    paddingHorizontal: 24,
  },
});
