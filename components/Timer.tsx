import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Audio } from "expo-av";
import { TimerState } from "../types";
import { TimerPhase } from "../hooks/useTimer";

interface TimerProps {
  timeRemaining: number;
  timerState: TimerState;
  progress: number;
  phase: TimerPhase;
  currentSide: number;
  totalSides: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

const CIRCLE_SIZE = 200;
const STROKE_WIDTH = 12;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function Timer({
  timeRemaining,
  timerState,
  progress,
  phase,
  currentSide,
  totalSides,
  onStart,
  onPause,
  onReset,
}: TimerProps) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Animate the progress smoothly - use 1000ms with linear easing to match tick interval
  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: timerState === "running" ? 1000 : 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [progress, animatedProgress, timerState]);

  // Pulse animation when finished
  useEffect(() => {
    if (timerState === "finished") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [timerState, pulseAnim]);

  // Play sound when timer finishes
  useEffect(() => {
    if (timerState === "finished") {
      playCompletionSound();
    }
  }, [timerState]);

  // Play sound when switching sides
  useEffect(() => {
    if (phase === "switching" && timerState === "running") {
      playSwitchSound();
    }
  }, [phase, timerState]);

  // Cleanup sound on unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const playCompletionSound = async () => {
    try {
      // Unload previous sound if exists
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      // Set audio mode for playback
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
      });

      // Use a pleasant chime sound from a CDN
      const { sound } = await Audio.Sound.createAsync(
        { uri: "https://cdn.freesound.org/previews/536/536420_4921277-lq.mp3" },
        { shouldPlay: true, volume: 0.8 }
      );
      soundRef.current = sound;
    } catch (error) {
      // Fallback: use haptics
      console.log("Could not play sound, using haptics:", error);
    }
  };

  const playSwitchSound = async () => {
    try {
      // Unload previous sound if exists
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      // Set audio mode for playback
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
      });

      // Use a notification sound for switching
      const { sound } = await Audio.Sound.createAsync(
        { uri: "https://cdn.freesound.org/previews/352/352661_5450487-lq.mp3" },
        { shouldPlay: true, volume: 0.8 }
      );
      soundRef.current = sound;
    } catch (error) {
      console.log("Could not play switch sound:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusColor = () => {
    if (phase === "switching" && timerState === "running") {
      return "#f97316"; // Orange for switching
    }
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
    if (phase === "switching" && timerState === "running") {
      return "Switch sides!";
    }
    switch (timerState) {
      case "running":
        return totalSides === 2 ? `Side ${currentSide} of ${totalSides}` : "Running";
      case "paused":
        return "Paused";
      case "finished":
        return "Complete!";
      default:
        return totalSides === 2 ? `Side 1 of ${totalSides}` : "Ready";
    }
  };

  const strokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, 0],
  });

  const statusColor = getStatusColor();

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.circleContainer,
          { transform: [{ scale: pulseAnim }] },
        ]}
      >
        <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} style={styles.svg}>
          {/* Background circle */}
          <Circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={RADIUS}
            stroke="#e2e8f0"
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          {/* Progress circle */}
          <AnimatedCircle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={RADIUS}
            stroke={statusColor}
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            rotation="-90"
            origin={`${CIRCLE_SIZE / 2}, ${CIRCLE_SIZE / 2}`}
          />
        </Svg>

        {/* Time display in center */}
        <View style={styles.timeContainer}>
          <Text style={[styles.time, { color: statusColor }]}>
            {formatTime(timeRemaining)}
          </Text>
          <Text style={[styles.status, { color: statusColor }]}>
            {getStatusText()}
          </Text>
        </View>
      </Animated.View>

      <View style={styles.buttonContainer}>
        {timerState === "running" ? (
          <TouchableOpacity
            style={[styles.button, styles.pauseButton]}
            onPress={onPause}
          >
            <Text style={styles.buttonText}>⏸ Pause</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.startButton]}
            onPress={onStart}
          >
            <Text style={styles.buttonText}>
              {timerState === "finished" ? "🔄 Restart" : "▶️ Start"}
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
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  circleContainer: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  svg: {
    position: "absolute",
  },
  timeContainer: {
    alignItems: "center",
  },
  time: {
    fontSize: 44,
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
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
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
