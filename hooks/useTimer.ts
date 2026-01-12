import { useState, useEffect, useCallback, useRef } from "react";
import { TimerState } from "../types";
import * as Haptics from "expo-haptics";

interface UseTimerReturn {
  timeRemaining: number;
  timerState: TimerState;
  progress: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

export function useTimer(totalSeconds: number): UseTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState(totalSeconds);
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const progress = totalSeconds > 0 ? (totalSeconds - timeRemaining) / totalSeconds : 0;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (timerState === "finished") {
      setTimeRemaining(totalSeconds);
    }
    setTimerState("running");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [timerState, totalSeconds]);

  const pause = useCallback(() => {
    setTimerState("paused");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setTimeRemaining(totalSeconds);
    setTimerState("idle");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [clearTimer, totalSeconds]);

  useEffect(() => {
    setTimeRemaining(totalSeconds);
    setTimerState("idle");
    clearTimer();
  }, [totalSeconds, clearTimer]);

  useEffect(() => {
    if (timerState === "running") {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearTimer();
            setTimerState("finished");
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearTimer();
    }

    return clearTimer;
  }, [timerState, clearTimer]);

  return {
    timeRemaining,
    timerState,
    progress,
    start,
    pause,
    reset,
  };
}
