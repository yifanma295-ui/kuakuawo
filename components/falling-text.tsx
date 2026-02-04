import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface FallingTextProps {
  text: string;
  style?: any;
  delay?: number;
  charDelay?: number;
}

/**
 * 逐字降落动画文本组件
 * 每个字符依次从上方降落，营造温柔的视觉效果
 */
export function FallingText({
  text,
  style,
  delay = 0,
  charDelay = 80,
}: FallingTextProps) {
  const characters = text.split("");

  return (
    <View style={styles.container}>
      {characters.map((char, index) => (
        <Animated.View
          key={`${char}-${index}`}
          entering={FadeInDown.duration(600)
            .delay(delay + index * charDelay)
            .springify()
            .damping(15)
            .stiffness(100)}
        >
          <Text style={style}>{char}</Text>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
});
