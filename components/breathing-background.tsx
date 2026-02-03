import React, { useEffect } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

interface BreathingBackgroundProps {
  children: React.ReactNode;
}

export function BreathingBackground({ children }: BreathingBackgroundProps) {
  const breathProgress = useSharedValue(0);

  useEffect(() => {
    // 8秒一个呼吸周期，非常缓慢柔和
    breathProgress.value = withRepeat(
      withTiming(1, {
        duration: 8000,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(breathProgress.value, [0, 1], [1, 1.05]);
    const opacity = interpolate(breathProgress.value, [0, 0.5, 1], [0.85, 1, 0.85]);
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.gradientContainer, animatedStyle]}>
        <LinearGradient
          colors={["#FFF8E7", "#FFECD2", "#FFE4D6", "#FFD8CC"]}
          locations={[0, 0.3, 0.7, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </Animated.View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E7",
  },
  gradientContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    flex: 1,
    width: width * 1.2,
    height: height * 1.2,
    marginLeft: -width * 0.1,
    marginTop: -height * 0.1,
  },
  content: {
    flex: 1,
  },
});
