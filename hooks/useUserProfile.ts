import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  UserProfile,
  UserProfileUpdate,
  Duration,
  ExperienceLevel,
  StretchType,
} from "../types/userProfile";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface UseUserProfileReturn {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  onboardingCompleted: boolean;
  savePreferences: (preferences: {
    muscleGroups: string[];
    duration: Duration;
    experienceLevel: ExperienceLevel;
    stretchType: StretchType;
  }) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useUserProfile(userId: string | undefined): UseUserProfileReturn {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (fetchError) {
        if (fetchError.code === "PGRST116") {
          // No profile found - this is expected for new users
          setProfile(null);
        } else {
          console.error("Error fetching profile:", fetchError);
          setError("Failed to load profile");
        }
      } else {
        setProfile(data as UserProfile);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const savePreferences = useCallback(
    async (preferences: {
      muscleGroups: string[];
      duration: Duration;
      experienceLevel: ExperienceLevel;
      stretchType: StretchType;
    }): Promise<boolean> => {
      if (!userId) return false;

      try {
        const profileData = {
          user_id: userId,
          onboarding_completed: true,
          preferred_muscle_groups: preferences.muscleGroups,
          preferred_duration: preferences.duration,
          experience_level: preferences.experienceLevel,
          preferred_stretch_type: preferences.stretchType,
          updated_at: new Date().toISOString(),
        };

        if (profile) {
          // Update existing profile
          const { error: updateError } = await supabase
            .from("user_profiles")
            .update(profileData)
            .eq("user_id", userId);

          if (updateError) {
            console.error("Error updating profile:", updateError);
            return false;
          }
        } else {
          // Insert new profile
          const { error: insertError } = await supabase
            .from("user_profiles")
            .insert(profileData);

          if (insertError) {
            console.error("Error creating profile:", insertError);
            return false;
          }
        }

        // Refetch to get the updated profile
        await fetchProfile();
        return true;
      } catch (err) {
        console.error("Error saving preferences:", err);
        return false;
      }
    },
    [userId, profile, fetchProfile]
  );

  return {
    profile,
    isLoading,
    error,
    onboardingCompleted: profile?.onboarding_completed ?? false,
    savePreferences,
    refetch: fetchProfile,
  };
}
