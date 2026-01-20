export interface Stretch {
  id: number;
  name: string;
  muscleGroups: string[];
  seconds: number;
  dynamic: boolean;
  duration: string;
  description: string;
  sides: number; // 1 = single side, 2 = both sides (left/right)
}

export interface Filters {
  muscleGroups: string[];
  minSeconds: number | null;
  maxSeconds: number | null;
  type: "all" | "dynamic" | "static";
}

export type TimerState = "idle" | "running" | "paused" | "finished";

export type ReactionType = "love" | "like" | "dislike" | "hate" | null;
