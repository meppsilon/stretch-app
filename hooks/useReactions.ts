import { useState, useEffect, useCallback } from "react";
import * as Haptics from "expo-haptics";
import { createClient } from "@supabase/supabase-js";
import { ReactionType } from "../types";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseUntyped = createClient(supabaseUrl, supabaseAnonKey);

interface StretchReaction {
  stretch_id: number;
  reaction: ReactionType;
}

interface UseReactionsReturn {
  reactions: Map<number, ReactionType>;
  getReaction: (stretchId: number) => ReactionType;
  setReaction: (stretchId: number, reaction: ReactionType) => void;
  getStretchesByReaction: (reaction: "love" | "like" | "dislike" | "hate") => number[];
  isLoading: boolean;
}

export function useReactions(userId: string | undefined): UseReactionsReturn {
  const [reactions, setReactions] = useState<Map<number, ReactionType>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadReactions();
    } else {
      setReactions(new Map());
      setIsLoading(false);
    }
  }, [userId]);

  const loadReactions = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabaseUntyped
        .from("stretch_reactions")
        .select("stretch_id, reaction")
        .eq("user_id", userId);

      if (error) {
        console.error("Error loading reactions:", error);
        return;
      }

      const reactionMap = new Map<number, ReactionType>();
      (data || []).forEach((row: StretchReaction) => {
        reactionMap.set(row.stretch_id, row.reaction);
      });
      setReactions(reactionMap);
    } catch (error) {
      console.error("Error loading reactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getReaction = useCallback(
    (stretchId: number): ReactionType => {
      return reactions.get(stretchId) || null;
    },
    [reactions]
  );

  const setReaction = useCallback(
    async (stretchId: number, reaction: ReactionType) => {
      if (!userId) return;

      const currentReaction = reactions.get(stretchId);

      try {
        if (reaction === null) {
          // Remove reaction
          if (currentReaction) {
            const { error } = await supabaseUntyped
              .from("stretch_reactions")
              .delete()
              .eq("user_id", userId)
              .eq("stretch_id", stretchId);

            if (error) {
              console.error("Error removing reaction:", error);
              return;
            }
          }
        } else if (currentReaction) {
          // Update existing reaction
          const { error } = await supabaseUntyped
            .from("stretch_reactions")
            .update({ reaction })
            .eq("user_id", userId)
            .eq("stretch_id", stretchId);

          if (error) {
            console.error("Error updating reaction:", error);
            return;
          }
        } else {
          // Insert new reaction
          const { error } = await supabaseUntyped
            .from("stretch_reactions")
            .insert({
              user_id: userId,
              stretch_id: stretchId,
              reaction,
            });

          if (error) {
            console.error("Error adding reaction:", error);
            return;
          }
        }

        // Update local state
        setReactions((prev) => {
          const newMap = new Map(prev);
          if (reaction === null) {
            newMap.delete(stretchId);
          } else {
            newMap.set(stretchId, reaction);
          }
          return newMap;
        });

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        console.error("Error setting reaction:", error);
      }
    },
    [userId, reactions]
  );

  const getStretchesByReaction = useCallback(
    (reaction: "love" | "like" | "dislike" | "hate"): number[] => {
      const result: number[] = [];
      reactions.forEach((r, stretchId) => {
        if (r === reaction) {
          result.push(stretchId);
        }
      });
      return result;
    },
    [reactions]
  );

  return {
    reactions,
    getReaction,
    setReaction,
    getStretchesByReaction,
    isLoading,
  };
}
