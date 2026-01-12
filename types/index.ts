export interface Stretch {
  name: string;
  muscleGroups: string[];
  seconds: number;
  dynamic: boolean;
  duration: string;
  description: string;
}

export interface Filters {
  muscleGroup: string | null;
  minSeconds: number | null;
  maxSeconds: number | null;
  type: "all" | "dynamic" | "static";
}

export type TimerState = "idle" | "running" | "paused" | "finished";
