import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Stretch, ReactionType } from "../types";

interface StretchCardProps {
  stretch: Stretch;
  reaction: ReactionType;
  onReaction: (reaction: ReactionType) => void;
}

const REACTIONS = [
  { type: "love" as const, emoji: "😍", label: "Love" },
  { type: "like" as const, emoji: "👍", label: "Like" },
  { type: "dislike" as const, emoji: "👎", label: "Dislike" },
  { type: "hate" as const, emoji: "😤", label: "Hate" },
];

export function StretchCard({
  stretch,
  reaction,
  onReaction,
}: StretchCardProps) {
  const handleReaction = (type: "love" | "like" | "dislike" | "hate") => {
    // Toggle off if already selected, otherwise set the reaction
    if (reaction === type) {
      onReaction(null);
    } else {
      onReaction(type);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{stretch.name}</Text>
      </View>

      <View style={styles.tagsContainer}>
        {stretch.muscleGroups.map((group) => (
          <View key={group} style={styles.tag}>
            <Text style={styles.tagText}>{group}</Text>
          </View>
        ))}
        <View style={[styles.tag, stretch.dynamic ? styles.dynamicTag : styles.staticTag]}>
          <Text style={styles.tagText}>{stretch.dynamic ? "dynamic" : "static"}</Text>
        </View>
      </View>

      <Text style={styles.description}>{stretch.description}</Text>

      <View style={styles.durationContainer}>
        <Text style={styles.durationLabel}>Duration:</Text>
        <Text style={styles.durationValue}>{stretch.duration}</Text>
      </View>

      <View style={styles.reactionsContainer}>
        {REACTIONS.map(({ type, emoji }) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.reactionButton,
              reaction === type && styles.reactionButtonActive,
            ]}
            onPress={() => handleReaction(type)}
          >
            <Text style={[
              styles.reactionEmoji,
              reaction !== type && reaction !== null && styles.reactionEmojiInactive,
            ]}>
              {emoji}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
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
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    flex: 1,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: "#e8f4f8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dynamicTag: {
    backgroundColor: "#fef3c7",
  },
  staticTag: {
    backgroundColor: "#dbeafe",
  },
  tagText: {
    fontSize: 13,
    color: "#4a5568",
    fontWeight: "500",
  },
  description: {
    fontSize: 16,
    color: "#4a5568",
    lineHeight: 24,
    marginBottom: 16,
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  durationLabel: {
    fontSize: 14,
    color: "#718096",
    marginRight: 8,
  },
  durationValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2d3748",
  },
  reactionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  reactionButton: {
    padding: 8,
    borderRadius: 12,
    minWidth: 50,
    alignItems: "center",
  },
  reactionButtonActive: {
    backgroundColor: "#f0f9ff",
  },
  reactionEmoji: {
    fontSize: 28,
  },
  reactionEmojiInactive: {
    opacity: 0.4,
  },
});
