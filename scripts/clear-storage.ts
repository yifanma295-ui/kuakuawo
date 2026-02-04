/**
 * 清除 AsyncStorage 中的所有数据
 * 用于重置应用为第一次启动状态，显示 Onboarding 界面
 * 
 * 使用方法：
 * 1. 在 React Native 环境中运行此脚本
 * 2. 或在 Expo Go 中通过 DevTools 执行
 * 3. 或在首页添加一个"重置应用"按钮来调用此函数
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = [
  "kuakuawo_state", // 主应用状态
  "kuakuawo_visitor_id", // 访客 ID
  // 添加其他可能的存储键
];

/**
 * 清除所有应用数据
 */
export async function clearAllStorage(): Promise<void> {
  try {
    console.log("开始清除应用数据...");
    
    // 方式 1：清除特定键
    await AsyncStorage.multiRemove(STORAGE_KEYS);
    
    console.log("✅ 应用数据已清除");
    console.log("请刷新应用或重启 Expo Go，您将看到 Onboarding 界面");
  } catch (error) {
    console.error("❌ 清除数据失败:", error);
    throw error;
  }
}

/**
 * 清除特定键的数据
 */
export async function clearStorageKey(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`✅ 已清除: ${key}`);
  } catch (error) {
    console.error(`❌ 清除 ${key} 失败:`, error);
    throw error;
  }
}

/**
 * 获取当前存储的所有数据（用于调试）
 */
export async function getAllStorageData(): Promise<Record<string, any>> {
  try {
    const data: Record<string, any> = {};
    
    for (const key of STORAGE_KEYS) {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        try {
          data[key] = JSON.parse(value);
        } catch {
          data[key] = value;
        }
      }
    }
    
    console.log("📦 当前存储数据:", data);
    return data;
  } catch (error) {
    console.error("❌ 获取存储数据失败:", error);
    throw error;
  }
}

// 如果直接运行此文件
if (require.main === module) {
  clearAllStorage()
    .then(() => {
      console.log("✨ 数据清除完成！");
    })
    .catch((error) => {
      console.error("错误:", error);
      process.exit(1);
    });
}
