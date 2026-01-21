import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Duration, ExperienceLevel, StretchType } from "../types/userProfile";
import { MuscleGroup } from "../hooks/useStretches";

interface OnboardingScreenProps {
  muscleGroups: MuscleGroup[];
  onComplete: (preferences: {
    muscleGroupIds: number[];
    duration: Duration;
    experienceLevel: ExperienceLevel;
    stretchType: StretchType;
  }) => Promise<void>;
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

export function OnboardingScreen({ muscleGroups, onComplete }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMuscleGroupIds, setSelectedMuscleGroupIds] = useState<number[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<Duration>("medium");
  const [selectedExperience, setSelectedExperience] = useState<ExperienceLevel>("beginner");
  const [selectedStretchType, setSelectedStretchType] = useState<StretchType>("all");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 4;

  const toggleMuscleGroup = (id: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedMuscleGroupIds((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    try {
      await onComplete({
        muscleGroupIds: selectedMuscleGroupIds,
        duration: selectedDuration,
        experienceLevel: selectedExperience,
        stretchType: selectedStretchType,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderProgressIndicator = () => (
    <View style={styles.progressContainer}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.progressDot,
            index === currentStep && styles.progressDotActive,
            index < currentStep && styles.progressDotCompleted,
          ]}
        />
      ))}
    </View>
  );

  const renderMuscleGroupsStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>What do you want to stretch?</Text>
      <Text style={styles.stepSubtitle}>Select all that apply</Text>
      <View style={styles.muscleGroupGrid}>
        {muscleGroups.map((group) => (
          <TouchableOpacity
            key={group.id}
            style={[
              styles.muscleGroupChip,
              selectedMuscleGroupIds.includes(group.id) && styles.muscleGroupChipSelected,
            ]}
            onPress={() => toggleMuscleGroup(group.id)}
          >
            <Text
              style={[
                styles.muscleGroupChipText,
                selectedMuscleGroupIds.includes(group.id) && styles.muscleGroupChipTextSelected,
              ]}
            >
              {group.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderDurationStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>How long do you like to stretch?</Text>
      <Text style={styles.stepSubtitle}>Choose your preferred duration</Text>
      <View style={styles.optionCards}>
        {DURATION_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionCard,
              selectedDuration === option.value && styles.optionCardSelected,
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedDuration(option.value);
            }}
          >
            <Text
              style={[
                styles.optionCardLabel,
                selectedDuration === option.value && styles.optionCardLabelSelected,
              ]}
            >
              {option.label}
            </Text>
            <Text
              style={[
                styles.optionCardDescription,
                selectedDuration === option.value && styles.optionCardDescriptionSelected,
              ]}
            >
              {option.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderExperienceStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>What's your experience level?</Text>
      <Text style={styles.stepSubtitle}>This helps us tailor recommendations</Text>
      <View style={styles.optionCards}>
        {EXPERIENCE_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionCard,
              selectedExperience === option.value && styles.optionCardSelected,
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedExperience(option.value);
            }}
          >
            <Text
              style={[
                styles.optionCardLabel,
                selectedExperience === option.value && styles.optionCardLabelSelected,
              ]}
            >
              {option.label}
            </Text>
            <Text
              style={[
                styles.optionCardDescription,
                selectedExperience === option.value && styles.optionCardDescriptionSelected,
              ]}
            >
              {option.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStretchTypeStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>What type of stretches?</Text>
      <Text style={styles.stepSubtitle}>Select your preference</Text>
      <View style={styles.optionCards}>
        {STRETCH_TYPE_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionCard,
              selectedStretchType === option.value && styles.optionCardSelected,
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedStretchType(option.value);
            }}
          >
            <Text
              style={[
                styles.optionCardLabel,
                selectedStretchType === option.value && styles.optionCardLabelSelected,
              ]}
            >
              {option.label}
            </Text>
            <Text
              style={[
                styles.optionCardDescription,
                selectedStretchType === option.value && styles.optionCardDescriptionSelected,
              ]}
            >
              {option.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderMuscleGroupsStep();
      case 1:
        return renderDurationStep();
      case 2:
        return renderExperienceStep();
      case 3:
        return renderStretchTypeStep();
      default:
        return null;
    }
  };

  const isLastStep = currentStep === totalSteps - 1;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.header}>Let's personalize your experience</Text>
        {renderProgressIndicator()}
        {renderCurrentStep()}
      </ScrollView>
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[styles.navButton, styles.backButton, currentStep === 0 && styles.navButtonHidden]}
          onPress={handleBack}
          disabled={currentStep === 0}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButton, styles.nextButton]}
          onPress={isLastStep ? handleComplete : handleNext}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.nextButtonText}>
              {isLastStep ? "Get Started" : "Next"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 24,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 32,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#e2e8f0",
  },
  progressDotActive: {
    backgroundColor: "#6366f1",
    width: 24,
  },
  progressDotCompleted: {
    backgroundColor: "#6366f1",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 24,
  },
  muscleGroupGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  muscleGroupChip: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  muscleGroupChipSelected: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  muscleGroupChipText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1a1a1a",
  },
  muscleGroupChipTextSelected: {
    color: "#fff",
  },
  optionCards: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  optionCardSelected: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  optionCardLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  optionCardLabelSelected: {
    color: "#fff",
  },
  optionCardDescription: {
    fontSize: 14,
    color: "#64748b",
  },
  optionCardDescriptionSelected: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  navigation: {
    flexDirection: "row",
    padding: 24,
    paddingTop: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
  },
  navButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  navButtonHidden: {
    opacity: 0,
  },
  backButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748b",
  },
  nextButton: {
    backgroundColor: "#6366f1",
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
