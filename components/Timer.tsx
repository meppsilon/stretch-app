import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { TimerState } from "../types";

interface TimerProps {
  timeRemaining: number;
  timerState: TimerState;
  progress: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function Timer({
  timeRemaining,
  timerState,
  progress,
  onStart,
  onPause,
  onReset,
}: TimerProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusColor = () => {
    switch (timerState) {
      case "running":
        return "#10b981";
      case "paused":
        return "#f59e0b";
      case "finished":
        return "#8b5cf6";
      default:
        return "#6366f1";
    }
  };

  const getStatusText = () => {
    switch (timerState) {
      case "running":
        return "Running";
      case "paused":
        return "Paused";
      case "finished":
        return "Complete!";
      default:
        return "Ready";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerDisplay}>
        <Text style={[styles.time, { color: getStatusColor() }]}>
          {formatTime(timeRemaining)}
        </Text>
        <Text style={[styles.status, { color: getStatusColor() }]}>
          {getStatusText()}
        </Text>
      </View>

      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${progress * 100}%`, backgroundColor: getStatusColor() },
          ]}
        />
      </View>

      <View style={styles.buttonContainer}>
        {timerState === "running" ? (
          <TouchableOpacity
            style={[styles.button, styles.pauseButton]}
            onPress={onPause}
          >
            <Text style={styles.buttonText}>Pause</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.startButton]}
            onPress={onStart}
          >
            <Text style={styles.buttonText}>
              {timerState === "finished" ? "Restart" : "Start"}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, styles.resetButton]}
          onPress={onReset}
        >
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  timerDisplay: {
    alignItems: "center",
    marginBottom: 16,
  },
  time: {
    fontSize: 48,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  status: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 20,
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  startButton: {
    backgroundColor: "#6366f1",
  },
  pauseButton: {
    backgroundColor: "#f59e0b",
  },
  resetButton: {
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  resetButtonText: {
    color: "#64748b",
    fontSize: 16,
    fontWeight: "600",
  },
});
