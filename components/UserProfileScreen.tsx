import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import * as Haptics from "expo-haptics";
import { UserProfile, Duration, ExperienceLevel, StretchType } from "../types/userProfile";

interface UserProfileScreenProps {
  profile: UserProfile | null;
  muscleGroups: string[];
  onSave: (preferences: {
    muscleGroups: string[];
    duration: Duration;
    experienceLevel: ExperienceLevel;
    stretchType: StretchType;
  }) => Promise<boolean>;
  onBack: () => void;
}

const DURATION_OPTIONS: { value: Duration; label: string; description: string }[] = [
  { value: "short", label: "Short", description: "15-30 seconds" },
  { value: "medium", label: "Medium", description: "30-60 seconds" },
  { value: "long", label: "Long", description: "60+ seconds" },
];

const EXPERIENCE_OPTIONS: { value: ExperienceLevel; label: string; description: string }[] = [
  { value: "beginner", label: "Beginner", description: "New to stretching" },
  { value: "intermediate", label: "Intermediate", description: "Some experience" },
  { value: "advanced", label: "Advanced", description: "Regular practice" },
];

const STRETCH_TYPE_OPTIONS: { value: StretchType; label: string; description: string }[] = [
  { value: "static", label: "Static", description: "Hold positions" },
  { value: "dynamic", label: "Dynamic", description: "Movement-based" },
  { value: "all", label: "Both", description: "Mix of both types" },
];

export function UserProfileScreen({
  profile,
  muscleGroups,
  onSave,
  onBack,
}: UserProfileScreenProps) {
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>(
    profile?.preferred_muscle_groups ?? []
  );
  const [selectedDuration, setSelectedDuration] = useState<Duration>(
    profile?.preferred_duration ?? "medium"
  );
  const [selectedExperience, setSelectedExperience] = useState<ExperienceLevel>(
    profile?.experience_level ?? "beginner"
  );
  const [selectedStretchType, setSelectedStretchType] = useState<StretchType>(
    profile?.preferred_stretch_type ?? "all"
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const toggleMuscleGroup = (group: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedMuscleGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const success = await onSave({
      muscleGroups: selectedMuscleGroups,
      duration: selectedDuration,
      experienceLevel: selectedExperience,
      stretchType: selectedStretchType,
    });

    setIsSaving(false);
    if (success) {
      setSaveMessage("Preferences saved!");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => setSaveMessage(null), 2000);
    } else {
      setSaveMessage("Failed to save. Please try again.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Preferences</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Muscle Groups Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Target Muscle Groups</Text>
          <View style={styles.muscleGroupGrid}>
            {muscleGroups.map((group) => (
              <TouchableOpacity
                key={group}
                style={[
                  styles.muscleGroupChip,
                  selectedMuscleGroups.includes(group) && styles.muscleGroupChipSelected,
                ]}
                onPress={() => toggleMuscleGroup(group)}
              >
                <Text
                  style={[
                    styles.muscleGroupChipText,
                    selectedMuscleGroups.includes(group) && styles.muscleGroupChipTextSelected,
                  ]}
                >
                  {group}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Duration Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stretch Duration</Text>
          <View style={styles.optionRow}>
            {DURATION_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  selectedDuration === option.value && styles.optionButtonSelected,
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedDuration(option.value);
                }}
              >
                <Text
                  style={[
                    styles.optionButtonLabel,
                    selectedDuration === option.value && styles.optionButtonLabelSelected,
                  ]}
                >
                  {option.label}
                </Text>
                <Text
                  style={[
                    styles.optionButtonDesc,
                    selectedDuration === option.value && styles.optionButtonDescSelected,
                  ]}
                >
                  {option.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Experience Level Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience Level</Text>
          <View style={styles.optionRow}>
            {EXPERIENCE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  selectedExperience === option.value && styles.optionButtonSelected,
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedExperience(option.value);
                }}
              >
                <Text
                  style={[
                    styles.optionButtonLabel,
                    selectedExperience === option.value && styles.optionButtonLabelSelected,
                  ]}
                >
                  {option.label}
                </Text>
                <Text
                  style={[
                    styles.optionButtonDesc,
                    selectedExperience === option.value && styles.optionButtonDescSelected,
                  ]}
                >
                  {option.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stretch Type Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stretch Type</Text>
          <View style={styles.optionRow}>
            {STRETCH_TYPE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  selectedStretchType === option.value && styles.optionButtonSelected,
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedStretchType(option.value);
                }}
              >
                <Text
                  style={[
                    styles.optionButtonLabel,
                    selectedStretchType === option.value && styles.optionButtonLabelSelected,
                  ]}
                >
                  {option.label}
                </Text>
                <Text
                  style={[
                    styles.optionButtonDesc,
                    selectedStretchType === option.value && styles.optionButtonDescSelected,
                  ]}
                >
                  {option.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>

        {saveMessage && (
          <Text
            style={[
              styles.saveMessage,
              saveMessage.includes("Failed") && styles.saveMessageError,
            ]}
          >
            {saveMessage}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: "#6366f1",
    fontWeight: "500",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  headerSpacer: {
    width: 60,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  muscleGroupGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  muscleGroupChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  muscleGroupChipSelected: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  muscleGroupChipText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1a1a1a",
  },
  muscleGroupChipTextSelected: {
    color: "#fff",
  },
  optionRow: {
    flexDirection: "row",
    gap: 8,
  },
  optionButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
  },
  optionButtonSelected: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  optionButtonLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  optionButtonLabelSelected: {
    color: "#fff",
  },
  optionButtonDesc: {
    fontSize: 11,
    color: "#64748b",
  },
  optionButtonDescSelected: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  saveButton: {
    backgroundColor: "#6366f1",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  saveMessage: {
    textAlign: "center",
    fontSize: 14,
    color: "#10b981",
    fontWeight: "500",
  },
  saveMessageError: {
    color: "#ef4444",
  },
});
