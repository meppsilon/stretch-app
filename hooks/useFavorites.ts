import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";

const FAVORITES_KEY = "@stretch_favorites";

interface UseFavoritesReturn {
  favorites: string[];
  isFavorite: (name: string) => boolean;
  toggleFavorite: (name: string) => void;
  isLoading: boolean;
}

export function useFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFavorites = async (newFavorites: string[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  };

  const isFavorite = useCallback(
    (name: string) => favorites.includes(name),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (name: string) => {
      setFavorites((prev) => {
        const newFavorites = prev.includes(name)
          ? prev.filter((f) => f !== name)
          : [...prev, name];
        saveFavorites(newFavorites);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        return newFavorites;
      });
    },
    []
  );

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    isLoading,
  };
}
