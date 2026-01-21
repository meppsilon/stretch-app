import { useRef, useCallback, useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Use untyped client for stretch_history table until types are regenerated
const supabaseUntyped = createClient(supabaseUrl, supabaseAnonKey);

type StretchStatus = "unstarted" | "started" | "paused" | "completed" | "abandoned";

interface UseStretchHistoryReturn {
  recordStretchAttempt: (stretchId: number) => Promise<void>;
  startSession: () => Promise<void>;
  updateStatus: (status: StretchStatus) => Promise<void>;
  abandonSession: () => Promise<void>;
  completeSession: () => Promise<void>;
  recentlyCompletedIds: Set<number>;
  incompleteStretchId: number | null;
  isLoadingIncomplete: boolean;
}

export function useStretchHistory(userId: string | undefined): UseStretchHistoryReturn {
  const currentSessionRef = useRef<number | null>(null);
  const [recentlyCompletedIds, setRecentlyCompletedIds] = useState<Set<number>>(new Set());
  const [incompleteStretchId, setIncompleteStretchId] = useState<number | null>(null);
  const [isLoadingIncomplete, setIsLoadingIncomplete] = useState(true);

  const fetchRecentlyCompleted = useCallback(async () => {
    if (!userId) {
      setRecentlyCompletedIds(new Set());
      return;
    }

    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabaseUntyped
        .from("stretch_history")
        .select("stretch_id")
        .eq("user_id", userId)
        .eq("status", "completed")
        .gte("completed_at", oneDayAgo);

      if (error) {
        console.error("Error fetching recently completed stretches:", error);
        return;
      }

      const ids = new Set<number>(data?.map((row: { stretch_id: number }) => row.stretch_id) || []);
      setRecentlyCompletedIds(ids);
    } catch (error) {
      console.error("Error fetching recently completed stretches:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchRecentlyCompleted();
  }, [fetchRecentlyCompleted]);

  // Fetch any incomplete session on mount
  useEffect(() => {
    const fetchIncompleteSession = async () => {
      if (!userId) {
        setIncompleteStretchId(null);
        setIsLoadingIncomplete(false);
        return;
      }

      try {
        const { data, error } = await supabaseUntyped
          .from("stretch_history")
          .select("id, stretch_id")
          .eq("user_id", userId)
          .in("status", ["started", "paused"])
          .order("started_at", { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== "PGRST116") {
          // PGRST116 = no rows returned, which is fine
          console.error("Error fetching incomplete session:", error);
        }

        if (data) {
          currentSessionRef.current = data.id;
          setIncompleteStretchId(data.stretch_id);
        }
      } catch (error) {
        console.error("Error fetching incomplete session:", error);
      } finally {
        setIsLoadingIncomplete(false);
      }
    };

    fetchIncompleteSession();
  }, [userId]);

  const recordStretchAttempt = useCallback(
    async (stretchId: number) => {
      if (!userId) return;

      // If there's an existing unstarted session, leave it as unstarted
      // If there's a started/paused session, abandon it
      if (currentSessionRef.current) {
        const { data } = await supabaseUntyped
          .from("stretch_history")
          .select("status")
          .eq("id", currentSessionRef.current)
          .single();

        if (data?.status === "started" || data?.status === "paused") {
          await updateSessionStatus("abandoned");
        }
        // Unstarted sessions remain as "unstarted" - no action needed
        currentSessionRef.current = null;
      }

      try {
        const { data, error } = await supabaseUntyped
          .from("stretch_history")
          .insert({
            user_id: userId,
            stretch_id: stretchId,
            status: "unstarted",
          })
          .select("id")
          .single();

        if (error) {
          console.error("Error recording stretch attempt:", error);
          return;
        }

        currentSessionRef.current = data?.id;
      } catch (error) {
        console.error("Error recording stretch attempt:", error);
      }
    },
    [userId]
  );

  const startSession = useCallback(async () => {
    if (!currentSessionRef.current) return;

    // Update the current unstarted session to started
    await updateSessionStatus("started");
  }, []);

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
    // Refresh recently completed list
    fetchRecentlyCompleted();
  }, [fetchRecentlyCompleted]);

  return {
    recordStretchAttempt,
    startSession,
    updateStatus,
    abandonSession,
    completeSession,
    recentlyCompletedIds,
    incompleteStretchId,
    isLoadingIncomplete,
  };
}
