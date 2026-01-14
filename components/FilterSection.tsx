import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { Filters } from "../types";

interface FilterSectionProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  matchCount: number;
  muscleGroups: string[];
}

export function FilterSection({
  filters,
  onFiltersChange,
  matchCount,
  muscleGroups,
}: FilterSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMuscleModal, setShowMuscleModal] = useState(false);

  const typeOptions: Array<"all" | "dynamic" | "static"> = ["all", "dynamic", "static"];

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleMuscleGroup = (group: string) => {
    const currentGroups = filters.muscleGroups;
    const newGroups = currentGroups.includes(group)
      ? currentGroups.filter((g) => g !== group)
      : [...currentGroups, group];
    updateFilter("muscleGroups", newGroups);
  };

  const clearFilters = () => {
    onFiltersChange({
      muscleGroups: [],
      minSeconds: null,
      maxSeconds: null,
      type: "all",
    });
  };

  const hasActiveFilters =
    filters.muscleGroups.length > 0 ||
    filters.minSeconds !== null ||
    filters.maxSeconds !== null ||
    filters.type !== "all";

  const getMuscleGroupDisplayText = () => {
    if (filters.muscleGroups.length === 0) {
      return "All";
    } else if (filters.muscleGroups.length === 1) {
      return filters.muscleGroups[0];
    } else {
      return `${filters.muscleGroups.length} selected`;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.headerText}>Filters</Text>
          {hasActiveFilters && <View style={styles.activeIndicator} />}
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.matchCount}>{matchCount} stretches</Text>
          <Text style={styles.chevron}>{isExpanded ? "▲" : "▼"}</Text>
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          {/* Muscle Group Picker */}
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Muscle Groups</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowMuscleModal(true)}
            >
              <Text style={[
                styles.pickerText,
                filters.muscleGroups.length > 0 && styles.pickerTextActive
              ]}>
                {getMuscleGroupDisplayText()}
              </Text>
              <Text style={styles.pickerChevron}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Type Toggle */}
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Type</Text>
            <View style={styles.toggleContainer}>
              {typeOptions.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.toggleButton,
                    filters.type === type && styles.toggleButtonActive,
                  ]}
                  onPress={() => updateFilter("type", type)}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      filters.type === type && styles.toggleTextActive,
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Clear Button */}
          {hasActiveFilters && (
            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <Text style={styles.clearButtonText}>Clear Filters</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Muscle Group Modal */}
      <Modal
        visible={showMuscleModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMuscleModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowMuscleModal(false)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Muscle Groups</Text>
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => setShowMuscleModal(false)}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              <TouchableOpacity
                style={[
                  styles.modalOption,
                  filters.muscleGroups.length === 0 && styles.modalOptionActive,
                ]}
                onPress={() => {
                  updateFilter("muscleGroups", []);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    filters.muscleGroups.length === 0 && styles.modalOptionTextActive,
                  ]}
                >
                  All
                </Text>
                {filters.muscleGroups.length === 0 && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
              {muscleGroups.map((group) => {
                const isSelected = filters.muscleGroups.includes(group);
                return (
                  <TouchableOpacity
                    key={group}
                    style={[
                      styles.modalOption,
                      isSelected && styles.modalOptionActive,
                    ]}
                    onPress={() => toggleMuscleGroup(group)}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        isSelected && styles.modalOptionTextActive,
                      ]}
                    >
                      {group}
                    </Text>
                    {isSelected && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#6366f1",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  matchCount: {
    fontSize: 14,
    color: "#64748b",
  },
  chevron: {
    fontSize: 12,
    color: "#64748b",
  },
  content: {
    padding: 16,
    paddingTop: 0,
    gap: 16,
  },
  filterRow: {
    gap: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4a5568",
  },
  pickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    padding: 12,
    borderRadius: 8,
  },
  pickerText: {
    fontSize: 15,
    color: "#1a1a1a",
  },
  pickerTextActive: {
    color: "#6366f1",
    fontWeight: "600",
  },
  pickerChevron: {
    fontSize: 12,
    color: "#64748b",
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  toggleTextActive: {
    color: "#6366f1",
    fontWeight: "600",
  },
  clearButton: {
    alignItems: "center",
    paddingVertical: 12,
  },
  clearButtonText: {
    fontSize: 14,
    color: "#ef4444",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "60%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  doneButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#6366f1",
    borderRadius: 8,
  },
  doneButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  modalScroll: {
    padding: 8,
  },
  modalOption: {
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalOptionActive: {
    backgroundColor: "#eef2ff",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#4a5568",
  },
  modalOptionTextActive: {
    color: "#6366f1",
    fontWeight: "600",
  },
  checkmark: {
    fontSize: 18,
    color: "#6366f1",
    fontWeight: "700",
  },
});
