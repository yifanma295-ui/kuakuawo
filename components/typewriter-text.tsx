import React, { useEffect, useState, useRef } from "react";
import { Text, StyleSheet, TextStyle } from "react-native";

interface TypewriterTextProps {
  text: string;
  speed?: number; // 每个字符的间隔时间（毫秒）
  style?: TextStyle;
  onComplete?: () => void;
}

export function TypewriterText({
  text,
  speed = 60,
  style,
  onComplete,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // 重置状态
    setDisplayedText("");
    setIsComplete(false);
    indexRef.current = 0;

    const typeNextChar = () => {
      if (indexRef.current < text.length) {
        setDisplayedText(text.slice(0, indexRef.current + 1));
        indexRef.current += 1;
        
        // 根据字符类型调整速度
        const currentChar = text[indexRef.current - 1];
        let delay = speed;
        
        // 标点符号后稍微停顿
        if (["，", "。", "！", "？", "；", "：", "、"].includes(currentChar)) {
          delay = speed * 3;
        } else if ([",", ".", "!", "?", ";", ":"].includes(currentChar)) {
          delay = speed * 2.5;
        }
        
        timeoutRef.current = setTimeout(typeNextChar, delay);
      } else {
        setIsComplete(true);
        onComplete?.();
      }
    };

    // 开始打字前稍作停顿
    timeoutRef.current = setTimeout(typeNextChar, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, speed, onComplete]);

  return (
    <Text style={[styles.text, style]}>
      {displayedText}
      {!isComplete && <Text style={styles.cursor}>|</Text>}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    lineHeight: 32,
    color: "#5D4037",
    fontFamily: "LXGWWenKai",
  },
  cursor: {
    opacity: 0.6,
  },
});
