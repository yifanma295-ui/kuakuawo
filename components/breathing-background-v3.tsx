import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export function BreathingBackgroundV3() {
  const progress = useSharedValue(0);

  useEffect(() => {
    // 呼吸动画：8秒一个周期，缓慢浮动
    progress.value = withRepeat(
      withTiming(1, {
        duration: 8000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    // 使用 progress 值在不同颜色之间插值
    const opacity1 = interpolate(progress.value, [0, 0.5, 1], [1, 0.6, 1]);
    const opacity2 = interpolate(progress.value, [0, 0.5, 1], [0.6, 1, 0.6]);
    
    return {
      opacity: 1,
    };
  });

  return (
    <AnimatedLinearGradient
      colors={[
        "#E3F2FD", // 淡蓝色
        "#FFE0B2", // 橘黄色
        "#F8BBD0", // 淡粉色
        "#E3F2FD", // 淡蓝色（循环）
      ]}
      locations={[0, 0.35, 0.65, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[StyleSheet.absoluteFillObject, animatedStyle]}
    />
  );
}
