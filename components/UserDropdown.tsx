import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import * as Haptics from "expo-haptics";

interface UserDropdownProps {
  userInitial: string;
  onProfilePress: () => void;
  onSignOut: () => void;
}

export function UserDropdown({ userInitial, onProfilePress, onSignOut }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsOpen(!isOpen);
  };

  const handleProfilePress = () => {
    setIsOpen(false);
    onProfilePress();
  };

  const handleSignOutPress = () => {
    setIsOpen(false);
    onSignOut();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.avatarButton} onPress={handleToggle}>
        <Text style={styles.avatarText}>{userInitial.toUpperCase()}</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
          <View style={styles.dropdownContainer}>
            <View style={styles.dropdown}>
              <TouchableOpacity style={styles.menuItem} onPress={handleProfilePress}>
                <Text style={styles.menuItemText}>Preferences</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.menuItem} onPress={handleSignOutPress}>
                <Text style={[styles.menuItemText, styles.signOutText]}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  avatarButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#6366f1",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  dropdownContainer: {
    position: "absolute",
    top: 100,
    right: 20,
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 160,
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: "#1a1a1a",
    fontWeight: "500",
  },
  signOutText: {
    color: "#ef4444",
  },
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
  },
});
