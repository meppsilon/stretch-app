export type Duration = "short" | "medium" | "long";
export type ExperienceLevel = "beginner" | "intermediate" | "advanced";
export type StretchType = "static" | "dynamic" | "all";

export interface UserProfile {
  id: string;
  user_id: string;
  onboarding_completed: boolean;
  preferred_muscle_groups: number[];
  preferred_duration: Duration;
  experience_level: ExperienceLevel;
  preferred_stretch_type: StretchType;
  created_at: string;
  updated_at: string;
}

export interface UserProfileUpdate {
  onboarding_completed?: boolean;
  preferred_muscle_groups?: number[];
  preferred_duration?: Duration;
  experience_level?: ExperienceLevel;
  preferred_stretch_type?: StretchType;
}
