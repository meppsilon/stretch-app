import { useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Use untyped client for stretch_history table until types are regenerated
const supabaseUntyped = createClient(supabaseUrl, supabaseAnonKey);

type StretchStatus = "started" | "paused" | "completed" | "abandoned";

interface UseStretchHistoryReturn {
  startSession: (stretchId: number) => Promise<void>;
  updateStatus: (status: StretchStatus) => Promise<void>;
  abandonSession: () => Promise<void>;
  completeSession: () => Promise<void>;
}

export function useStretchHistory(userId: string | undefined): UseStretchHistoryReturn {
  const currentSessionRef = useRef<number | null>(null);

  const startSession = useCallback(
    async (stretchId: number) => {
      if (!userId) return;

      // If there's an existing session, abandon it first
      if (currentSessionRef.current) {
        await updateSessionStatus("abandoned");
      }

      try {
        const { data, error } = await supabaseUntyped
          .from("stretch_history")
          .insert({
            user_id: userId,
            stretch_id: stretchId,
            status: "started",
          })
          .select("id")
          .single();

        if (error) {
          console.error("Error starting stretch session:", error);
          return;
        }

        currentSessionRef.current = data?.id;
      } catch (error) {
        console.error("Error starting stretch session:", error);
      }
    },
    [userId]
  );

  const updateSessionStatus = async (status: StretchStatus) => {
    if (!currentSessionRef.current) return;

    try {
      const updateData: Record<string, any> = { status };

      if (status === "completed" || status === "abandoned") {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabaseUntyped
        .from("stretch_history")
        .update(updateData)
        .eq("id", currentSessionRef.current);

      if (error) {
        console.error("Error updating stretch session:", error);
        return;
      }

      if (status === "completed" || status === "abandoned") {
        currentSessionRef.current = null;
      }
    } catch (error) {
      console.error("Error updating stretch session:", error);
    }
  };

  const updateStatus = useCallback(
    async (status: StretchStatus) => {
      await updateSessionStatus(status);
    },
    []
  );

  const abandonSession = useCallback(async () => {
    await updateSessionStatus("abandoned");
  }, []);

  const completeSession = useCallback(async () => {
    await updateSessionStatus("completed");
  }, []);

  return {
    startSession,
    updateStatus,
    abandonSession,
    completeSession,
  };
}
