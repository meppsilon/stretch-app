import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Haptics from "expo-haptics";

import { Stretch, Filters } from "./types";
import { stretches, filterStretches, getRandomStretch } from "./data/stretches";
import { useTimer } from "./hooks/useTimer";
import { useFavorites } from "./hooks/useFavorites";
import { StretchCard } from "./components/StretchCard";
import { Timer } from "./components/Timer";
import { FilterSection } from "./components/FilterSection";

export default function App() {
  const [currentStretch, setCurrentStretch] = useState<Stretch | null>(null);
  const [filters, setFilters] = useState<Filters>({
    muscleGroup: null,
    minSeconds: null,
    maxSeconds: null,
    type: "all",
  });
  const [showFavorites, setShowFavorites] = useState(false);

  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  const filteredStretches = useMemo(
    () => filterStretches(stretches, filters),
    [filters]
  );

  const favoriteStretches = useMemo(
    () => stretches.filter((s) => favorites.includes(s.name)),
    [favorites]
  );

  const timer = useTimer(currentStretch?.seconds ?? 0);

  const handleNewStretch = () => {
    const stretch = getRandomStretch(filteredStretches);
    setCurrentStretch(stretch);
    timer.reset();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleSelectFavorite = (stretch: Stretch) => {
    setCurrentStretch(stretch);
    timer.reset();
    setShowFavorites(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.title}>Stretch</Text>

        <FilterSection
          filters={filters}
          onFiltersChange={setFilters}
          matchCount={filteredStretches.length}
        />

        {currentStretch ? (
          <>
            <StretchCard
              stretch={currentStretch}
              isFavorite={isFavorite(currentStretch.name)}
              onToggleFavorite={() => toggleFavorite(currentStretch.name)}
            />
            <Timer
              timeRemaining={timer.timeRemaining}
              timerState={timer.timerState}
              progress={timer.progress}
              onStart={timer.start}
              onPause={timer.pause}
              onReset={timer.reset}
            />
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateEmoji}>🧘</Text>
            <Text style={styles.emptyStateText}>
              Tap the button below to get a random stretch
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.newStretchButton} onPress={handleNewStretch}>
          <Text style={styles.newStretchButtonText}>🎲 New Stretch</Text>
        </TouchableOpacity>

        {/* Favorites Section */}
        <View style={styles.favoritesSection}>
          <TouchableOpacity
            style={styles.favoritesHeader}
            onPress={() => setShowFavorites(!showFavorites)}
          >
            <Text style={styles.favoritesTitle}>
              ❤️ Favorites ({favorites.length})
            </Text>
            <Text style={styles.chevron}>{showFavorites ? "▲" : "▼"}</Text>
          </TouchableOpacity>

          {showFavorites && (
            <View style={styles.favoritesList}>
              {favoriteStretches.length === 0 ? (
                <Text style={styles.noFavorites}>
                  No favorites yet. Tap the heart on a stretch to add it!
                </Text>
              ) : (
                favoriteStretches.map((stretch) => (
                  <TouchableOpacity
                    key={stretch.name}
                    style={styles.favoriteItem}
                    onPress={() => handleSelectFavorite(stretch)}
                  >
                    <Text style={styles.favoriteItemText}>{stretch.name}</Text>
                    <Text style={styles.favoriteItemMuscles}>
                      {stretch.muscleGroups.slice(0, 2).join(", ")}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 8,
  },
  emptyState: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
  },
  newStretchButton: {
    backgroundColor: "#6366f1",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  newStretchButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  favoritesSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  favoritesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  favoritesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  chevron: {
    fontSize: 12,
    color: "#64748b",
  },
  favoritesList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  noFavorites: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    paddingVertical: 12,
  },
  favoriteItem: {
    backgroundColor: "#f8fafc",
    padding: 14,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  favoriteItemText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1a1a1a",
  },
  favoriteItemMuscles: {
    fontSize: 13,
    color: "#64748b",
  },
});
