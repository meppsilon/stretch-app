import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Haptics from "expo-haptics";
import { ClerkProvider, ClerkLoaded, SignedIn, SignedOut, useUser, useClerk } from "@clerk/clerk-expo";

import { tokenCache } from "./lib/tokenCache";
import { Stretch, Filters, TimerState, ReactionType } from "./types";
import { useStretches } from "./hooks/useStretches";
import { useTimer } from "./hooks/useTimer";
import { useReactions } from "./hooks/useReactions";
import { useStretchHistory } from "./hooks/useStretchHistory";
import { StretchCard } from "./components/StretchCard";
import { Timer } from "./components/Timer";
import { FilterSection } from "./components/FilterSection";
import { SignInScreen } from "./components/SignInScreen";
import { SignUpScreen } from "./components/SignUpScreen";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

function AuthScreens() {
  const [showSignUp, setShowSignUp] = useState(false);

  if (showSignUp) {
    return <SignUpScreen onSwitchToSignIn={() => setShowSignUp(false)} />;
  }

  return <SignInScreen onSwitchToSignUp={() => setShowSignUp(true)} />;
}

function MainApp() {
  const { user } = useUser();
  const { signOut } = useClerk();

  const [currentStretch, setCurrentStretch] = useState<Stretch | null>(null);
  const [filters, setFilters] = useState<Filters>({
    muscleGroups: [],
    minSeconds: null,
    maxSeconds: null,
    type: "all",
  });
  const [showLoved, setShowLoved] = useState(false);

  const {
    stretches,
    muscleGroups,
    isLoading,
    error,
    filterStretches,
    getRandomStretch,
  } = useStretches();
  const { getReaction, setReaction, getStretchesByReaction } = useReactions(user?.id);
  const stretchHistory = useStretchHistory(user?.id);
  const prevTimerStateRef = useRef<TimerState>("idle");

  const filteredStretches = useMemo(
    () => filterStretches(filters),
    [filters, filterStretches]
  );

  const lovedStretchIds = getStretchesByReaction("love");
  const lovedStretches = useMemo(
    () => stretches.filter((s) => lovedStretchIds.includes(s.id)),
    [stretches, lovedStretchIds]
  );

  const timer = useTimer(currentStretch?.seconds ?? 0);

  // Track timer state changes for history
  useEffect(() => {
    const prevState = prevTimerStateRef.current;
    const currentState = timer.timerState;

    if (prevState !== currentState && currentStretch) {
      if (currentState === "running" && prevState === "idle") {
        // Started a new session
        stretchHistory.startSession(currentStretch.id);
      } else if (currentState === "paused") {
        // Paused
        stretchHistory.updateStatus("paused");
      } else if (currentState === "running" && prevState === "paused") {
        // Resumed from pause
        stretchHistory.updateStatus("started");
      } else if (currentState === "finished") {
        // Completed
        stretchHistory.completeSession();
      }
    }

    prevTimerStateRef.current = currentState;
  }, [timer.timerState, currentStretch, stretchHistory]);

  const handleNewStretch = () => {
    // Abandon current session if timer was running
    if (currentStretch && (timer.timerState === "running" || timer.timerState === "paused")) {
      stretchHistory.abandonSession();
    }

    const stretch = getRandomStretch(filteredStretches);
    setCurrentStretch(stretch);
    timer.reset();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleSelectLoved = (stretch: Stretch) => {
    // Abandon current session if timer was running
    if (currentStretch && (timer.timerState === "running" || timer.timerState === "paused")) {
      stretchHistory.abandonSession();
    }

    setCurrentStretch(stretch);
    timer.reset();
    setShowLoved(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSignOut = async () => {
    await signOut();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Stretch</Text>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.loadingText}>Loading stretches...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorState}>
            <Text style={styles.errorEmoji}>⚠️</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <>
            <FilterSection
              filters={filters}
              onFiltersChange={setFilters}
              matchCount={filteredStretches.length}
              muscleGroups={muscleGroups}
            />

            {currentStretch ? (
              <>
                <StretchCard
                  stretch={currentStretch}
                  reaction={getReaction(currentStretch.id)}
                  onReaction={(reaction: ReactionType) => setReaction(currentStretch.id, reaction)}
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
              <Text style={styles.newStretchButtonText}>New Stretch</Text>
            </TouchableOpacity>

            {/* Loved Stretches Section */}
            <View style={styles.lovedSection}>
              <TouchableOpacity
                style={styles.lovedHeader}
                onPress={() => setShowLoved(!showLoved)}
              >
                <Text style={styles.lovedTitle}>
                  Loved ({lovedStretches.length})
                </Text>
                <Text style={styles.chevron}>{showLoved ? "▲" : "▼"}</Text>
              </TouchableOpacity>

              {showLoved && (
                <View style={styles.lovedList}>
                  {lovedStretches.length === 0 ? (
                    <Text style={styles.noLoved}>
                      No loved stretches yet. React with 😍 to add one!
                    </Text>
                  ) : (
                    lovedStretches.map((stretch) => (
                      <TouchableOpacity
                        key={stretch.id}
                        style={styles.lovedItem}
                        onPress={() => handleSelectLoved(stretch)}
                      >
                        <Text style={styles.lovedItemText}>{stretch.name}</Text>
                        <Text style={styles.lovedItemMuscles}>
                          {stretch.muscleGroups.slice(0, 2).join(", ")}
                        </Text>
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <SignedIn>
          <MainApp />
        </SignedIn>
        <SignedOut>
          <AuthScreens />
        </SignedOut>
      </ClerkLoaded>
    </ClerkProvider>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  signOutButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
  },
  signOutText: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "500",
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
  loadingState: {
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
  loadingText: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 16,
  },
  errorState: {
    backgroundColor: "#fef2f2",
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#dc2626",
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
  lovedSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lovedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  lovedTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  chevron: {
    fontSize: 12,
    color: "#64748b",
  },
  lovedList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  noLoved: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    paddingVertical: 12,
  },
  lovedItem: {
    backgroundColor: "#f8fafc",
    padding: 14,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lovedItemText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1a1a1a",
  },
  lovedItemMuscles: {
    fontSize: 13,
    color: "#64748b",
  },
});
