import React, { useEffect } from "react";
import { Text, StyleSheet, Platform, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

interface BreathingButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export function BreathingButton({ onPress, disabled }: BreathingButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const rippleScale = useSharedValue(0);
  const rippleOpacity = useSharedValue(0);
  const glowOpacity = useSharedValue(0.3);
  const waveScale1 = useSharedValue(1);
  const waveScale2 = useSharedValue(1);
  const waveOpacity1 = useSharedValue(0.3);
  const waveOpacity2 = useSharedValue(0.3);

  // 呼吸动画 - 更缓慢、更有节奏
  useEffect(() => {
    // 主按钮呼吸
    scale.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.98, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
    
    // 光晕呼吸
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.2, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
    
    // 水波纹呼吸效果 - 第一层
    waveScale1.value = withRepeat(
      withTiming(1.3, { duration: 3000, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );
    waveOpacity1.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 0 }),
        withTiming(0, { duration: 3000, easing: Easing.out(Easing.ease) })
      ),
      -1,
      false
    );
    
    // 水波纹呼吸效果 - 第二层（延迟 1.5 秒）
    setTimeout(() => {
      waveScale2.value = withRepeat(
        withTiming(1.3, { duration: 3000, easing: Easing.out(Easing.ease) }),
        -1,
        false
      );
      waveOpacity2.value = withRepeat(
        withSequence(
          withTiming(0.4, { duration: 0 }),
          withTiming(0, { duration: 3000, easing: Easing.out(Easing.ease) })
        ),
        -1,
        false
      );
    }, 1500);
  }, [scale, glowOpacity, waveScale1, waveScale2, waveOpacity1, waveOpacity2]);

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
      rippleOpacity.value = 0.4;
      rippleScale.value = withTiming(1.6, { duration: 700, easing: Easing.out(Easing.ease) });
      rippleOpacity.value = withTiming(0, { duration: 700 });
      
      triggerHaptic();
    })
    .onEnd(() => {
      // 恢复呼吸动画
      scale.value = withSequence(
        withTiming(1, { duration: 150 }),
        withRepeat(
          withSequence(
            withTiming(1.02, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
            withTiming(0.98, { duration: 2000, easing: Easing.inOut(Easing.sin) })
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

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));
  
  const animatedWave1Style = useAnimatedStyle(() => ({
    transform: [{ scale: waveScale1.value }],
    opacity: waveOpacity1.value,
  }));
  
  const animatedWave2Style = useAnimatedStyle(() => ({
    transform: [{ scale: waveScale2.value }],
    opacity: waveOpacity2.value,
  }));

  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={[styles.container]}>
        {/* 外层光晕 */}
        <Animated.View style={[styles.glow, animatedGlowStyle]}>
          <LinearGradient
            colors={["rgba(255, 138, 128, 0.4)", "rgba(255, 183, 77, 0.2)", "transparent"]}
            style={styles.glowGradient}
            start={{ x: 0.5, y: 0.5 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>
        
        {/* 水波纹呼吸效果 - 第一层 */}
        <Animated.View style={[styles.wave, animatedWave1Style]}>
          <LinearGradient
            colors={["rgba(100, 181, 246, 0.3)", "rgba(255, 183, 77, 0.2)", "rgba(244, 143, 177, 0.2)"]}
            style={styles.waveGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>
        
        {/* 水波纹呼吸效果 - 第二层 */}
        <Animated.View style={[styles.wave, animatedWave2Style]}>
          <LinearGradient
            colors={["rgba(244, 143, 177, 0.3)", "rgba(255, 183, 77, 0.2)", "rgba(100, 181, 246, 0.2)"]}
            style={styles.waveGradient}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
        </Animated.View>
        
        {/* 点击水波纹效果 */}
        <Animated.View style={[styles.ripple, animatedRippleStyle]}>
          <LinearGradient
            colors={["rgba(255, 138, 128, 0.3)", "rgba(255, 183, 77, 0.1)"]}
            style={styles.rippleGradient}
          />
        </Animated.View>
        
        {/* 主按钮 - 磨砂玻璃质感 */}
        <Animated.View style={[styles.button, animatedButtonStyle]}>
          {/* 背景渐变 - 淡蓝色到橘黄色到淡粉色（更平滑的渐变） */}
          <LinearGradient
            colors={[
              "#64B5F6",
              "#7EC4F8",
              "#98D3FA",
              "#B2D8F7",
              "#CCDDF4",
              "#E6E2F1",
              "#FFE7CE",
              "#FFDEBD",
              "#FFD5AC",
              "#FFCCA0",
              "#FFC3A0",
              "#FFBAA0",
              "#FFB1A5",
              "#FFA8AA",
              "#F48FB1"
            ]}
            locations={[0, 0.07, 0.14, 0.21, 0.28, 0.35, 0.42, 0.49, 0.56, 0.63, 0.70, 0.77, 0.84, 0.91, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          />
          {/* 磨砂玻璃覆盖层 */}
          <View style={styles.frostedOverlay} />
          {/* 高光效果 */}
          <LinearGradient
            colors={["rgba(255, 255, 255, 0.4)", "rgba(255, 255, 255, 0.1)", "transparent"]}
            start={{ x: 0.3, y: 0 }}
            end={{ x: 0.7, y: 0.6 }}
            style={styles.highlight}
          />
          {/* 文字 */}
          <View style={styles.textContainer}>
            <Text style={styles.buttonText}>今天也夸夸</Text>
            <Text style={styles.buttonText}>自己吧</Text>
          </View>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: 240,
    height: 240,
  },
  glow: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    overflow: "hidden",
  },
  glowGradient: {
    flex: 1,
    borderRadius: 140,
  },
  wave: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: "hidden",
  },
  waveGradient: {
    flex: 1,
    borderRadius: 100,
  },
  ripple: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: "hidden",
  },
  rippleGradient: {
    flex: 1,
    borderRadius: 100,
  },
  button: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    // 阴影 - 边缘模糊化
    shadowColor: "#64B5F6",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 30,
    elevation: 15,
  },
  buttonGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 90,
  },
  frostedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 90,
  },
  highlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    borderTopLeftRadius: 90,
    borderTopRightRadius: 90,
  },
  textContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    fontFamily: "LXGWWenKai",
  },
});
