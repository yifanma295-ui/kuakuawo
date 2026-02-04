/**
 * 调试工具：重置应用按钮
 * 用于清除所有本地数据，重新显示 Onboarding 界面
 * 
 * 仅在开发环境中显示
 */

import { Pressable, Text, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

interface DebugResetButtonProps {
  visible?: boolean;
}

export function DebugResetButton({ visible = true }: DebugResetButtonProps) {
  // 仅在开发环境显示
  if (!__DEV__ || !visible) {
    return null;
  }

  const handleReset = async () => {
    Alert.alert(
      "重置应用",
      "确定要清除所有数据并重新显示 Onboarding 界面吗？",
      [
        {
          text: "取消",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "确定重置",
          onPress: async () => {
            try {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              
              // 清除所有数据
              await AsyncStorage.multiRemove([
                "kuakuawo_state",
                "kuakuawo_visitor_id",
              ]);
              
              // 重新加载应用
              router.replace("/onboarding" as any);
              
              console.log("✅ 应用已重置，显示 Onboarding 界面");
            } catch (error) {
              console.error("❌ 重置失败:", error);
              Alert.alert("错误", "重置应用失败，请重试");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <Pressable
      onPress={handleReset}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.text}>🔄 重置应用</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#FFE5E5",
    borderWidth: 1,
    borderColor: "#FF8A80",
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    fontSize: 12,
    color: "#FF8A80",
    fontWeight: "600",
  },
});
