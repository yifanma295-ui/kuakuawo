import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import * as Haptics from "expo-haptics";

interface NicknameEditModalProps {
  visible: boolean;
  currentNickname: string;
  onClose: () => void;
  onSave: (nickname: string) => void;
}

export function NicknameEditModal({
  visible,
  currentNickname,
  onClose,
  onSave,
}: NicknameEditModalProps) {
  const [nickname, setNickname] = useState(currentNickname);

  useEffect(() => {
    if (visible) {
      setNickname(currentNickname);
    }
  }, [visible, currentNickname]);

  const handleSave = () => {
    const trimmedNickname = nickname.trim();
    if (trimmedNickname && trimmedNickname !== currentNickname) {
      onSave(trimmedNickname);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.modal}>
          <Text style={styles.title}>修改昵称</Text>
          <Text style={styles.subtitle}>我该怎么称呼你呢？</Text>
          
          <TextInput
            style={styles.input}
            value={nickname}
            onChangeText={setNickname}
            placeholder="输入你的昵称"
            placeholderTextColor="rgba(93, 64, 55, 0.4)"
            maxLength={20}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />
          
          <View style={styles.buttonRow}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.button,
                styles.cancelButton,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={styles.cancelButtonText}>取消</Text>
            </Pressable>
            
            <Pressable
              onPress={handleSave}
              style={({ pressed }) => [
                styles.button,
                styles.saveButton,
                pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] },
              ]}
            >
              <Text style={styles.saveButtonText}>确认</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    width: "85%",
    maxWidth: 400,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#5D4037",
    marginBottom: 8,
    fontFamily: "LXGWWenKai",
  },
  subtitle: {
    fontSize: 15,
    color: "#8B5A2B",
    marginBottom: 24,
    fontFamily: "LXGWWenKai",
  },
  input: {
    width: "100%",
    height: 56,
    backgroundColor: "rgba(255, 248, 231, 0.8)",
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#5D4037",
    borderWidth: 2,
    borderColor: "rgba(255, 138, 128, 0.2)",
    fontFamily: "LXGWWenKai",
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "rgba(139, 90, 43, 0.1)",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8B5A2B",
    fontFamily: "LXGWWenKai",
  },
  saveButton: {
    backgroundColor: "#FF8A80",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "LXGWWenKai",
  },
});
