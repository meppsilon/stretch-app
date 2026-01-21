import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { Stretch, Filters } from "../types";

interface UseStretchesReturn {
  stretches: Stretch[];
  muscleGroups: string[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  filterStretches: (filters: Filters) => Stretch[];
  getRandomStretch: (filtered: Stretch[], preferredMuscleGroups?: string[]) => Stretch | null;
}

interface StretchQueryResult {
  id: number;
  name: string;
  seconds: number;
  dynamic: boolean;
  duration: string;
  description: string;
  sides: number;
  created_at: string;
  muscle_groups: Array<{
    muscle_group: {
      id: number;
      name: string;
    };
  }>;
}

export function useStretches(): UseStretchesReturn {
  const [stretches, setStretches] = useState<Stretch[]>([]);
  const [allMuscleGroups, setAllMuscleGroups] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch stretches with their muscle groups via the junction table
      const { data: stretchData, error: stretchError } = await supabase
        .from("stretches")
        .select(`
          *,
          muscle_groups:stretch_muscle_groups(
            muscle_group:muscle_groups(*)
          )
        `)
        .order("name");

      if (stretchError) throw stretchError;

      // Fetch all muscle groups for the filter dropdown
      const { data: muscleGroupData, error: muscleGroupError } = await supabase
        .from("muscle_groups")
        .select("name")
        .order("name");

      if (muscleGroupError) throw muscleGroupError;

      // Transform the data to match our Stretch interface
      const transformedStretches = ((stretchData || []) as StretchQueryResult[]).map((row) => {
        const muscleGroupNames = row.muscle_groups
          .map((smg) => smg.muscle_group?.name)
          .filter((name): name is string => Boolean(name));

        return {
          id: row.id,
          name: row.name,
          muscleGroups: muscleGroupNames,
          seconds: row.seconds,
          dynamic: row.dynamic,
          duration: row.duration,
          description: row.description,
          sides: row.sides ?? 1, // Default to 1 side if not set
        } as Stretch;
      });

      setStretches(transformedStretches);
      setAllMuscleGroups((muscleGroupData || []).map((mg: { name: string }) => mg.name));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch stretches");
      console.error("Error fetching stretches:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filterStretches = useCallback(
    (filters: Filters): Stretch[] => {
      let result = stretches;

      if (filters.muscleGroups.length > 0) {
        result = result.filter((s) =>
          filters.muscleGroups.some((group) => s.muscleGroups.includes(group))
        );
      }

      if (filters.minSeconds !== null) {
        result = result.filter((s) => s.seconds >= filters.minSeconds!);
      }

      if (filters.maxSeconds !== null) {
        result = result.filter((s) => s.seconds <= filters.maxSeconds!);
      }

      if (filters.type === "dynamic") {
        result = result.filter((s) => s.dynamic);
      } else if (filters.type === "static") {
        result = result.filter((s) => !s.dynamic);
      }

      return result;
    },
    [stretches]
  );

  const getRandomStretch = useCallback(
    (filtered: Stretch[], preferredMuscleGroups?: string[]): Stretch | null => {
      if (filtered.length === 0) return null;

      // If no preferences, use uniform random selection
      if (!preferredMuscleGroups || preferredMuscleGroups.length === 0) {
        return filtered[Math.floor(Math.random() * filtered.length)];
      }

      // Weighted selection: stretches matching preferred muscle groups get 2x weight
      const weights = filtered.map((stretch) => {
        const matchesPreferred = stretch.muscleGroups.some((mg) =>
          preferredMuscleGroups.includes(mg)
        );
        return matchesPreferred ? 2 : 1;
      });

      const totalWeight = weights.reduce((sum, w) => sum + w, 0);
      let random = Math.random() * totalWeight;

      for (let i = 0; i < filtered.length; i++) {
        random -= weights[i];
        if (random <= 0) {
          return filtered[i];
        }
      }

      // Fallback (shouldn't reach here)
      return filtered[filtered.length - 1];
    },
    []
  );

  return {
    stretches,
    muscleGroups: allMuscleGroups,
    isLoading,
    error,
    refetch: fetchData,
    filterStretches,
    getRandomStretch,
  };
}
