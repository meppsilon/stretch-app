import { useState, useEffect, useCallback, useRef } from "react";
import { TimerState } from "../types";
import * as Haptics from "expo-haptics";

export type TimerPhase = "side1" | "switching" | "side2";

interface UseTimerReturn {
  timeRemaining: number;
  timerState: TimerState;
  progress: number;
  phase: TimerPhase;
  currentSide: number;
  totalSides: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

const SWITCH_TIME = 3; // 3 seconds to switch sides

export function useTimer(secondsPerSide: number, sides: number = 1): UseTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState(secondsPerSide);
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [phase, setPhase] = useState<TimerPhase>("side1");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate total time for progress calculation
  const totalTime = sides === 2
    ? secondsPerSide * 2 + SWITCH_TIME
    : secondsPerSide;

  // Calculate elapsed time based on current phase
  const getElapsedTime = useCallback(() => {
    if (phase === "side1") {
      return secondsPerSide - timeRemaining;
    } else if (phase === "switching") {
      return secondsPerSide + (SWITCH_TIME - timeRemaining);
    } else {
      // side2
      return secondsPerSide + SWITCH_TIME + (secondsPerSide - timeRemaining);
    }
  }, [phase, timeRemaining, secondsPerSide]);

  const progress = totalTime > 0 ? getElapsedTime() / totalTime : 0;

  const currentSide = phase === "side2" ? 2 : 1;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (timerState === "finished") {
      // Reset everything for a fresh start
      setTimeRemaining(secondsPerSide);
      setPhase("side1");
    }
    setTimerState("running");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [timerState, secondsPerSide]);

  const pause = useCallback(() => {
    setTimerState("paused");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setTimeRemaining(secondsPerSide);
    setTimerState("idle");
    setPhase("side1");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [clearTimer, secondsPerSide]);

  // Reset when stretch changes
  useEffect(() => {
    setTimeRemaining(secondsPerSide);
    setTimerState("idle");
    setPhase("side1");
    clearTimer();
  }, [secondsPerSide, sides, clearTimer]);

  // Main timer logic
  useEffect(() => {
    if (timerState === "running") {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Time for this phase is up
            if (phase === "side1" && sides === 2) {
              // Transition to switching phase
              setPhase("switching");
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              return SWITCH_TIME;
            } else if (phase === "switching") {
              // Transition to side 2
              setPhase("side2");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              return secondsPerSide;
            } else {
              // Timer complete (side1 for single-side, or side2 for two-sided)
              clearTimer();
              setTimerState("finished");
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearTimer();
    }

    return clearTimer;
  }, [timerState, phase, sides, secondsPerSide, clearTimer]);

  return {
    timeRemaining,
    timerState,
    progress,
    phase,
    currentSide,
    totalSides: sides,
    start,
    pause,
    reset,
  };
}
