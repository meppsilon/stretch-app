import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useSignIn, useSSO } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

WebBrowser.maybeCompleteAuthSession();

interface SignInScreenProps {
  onSwitchToSignUp: () => void;
}

export function SignInScreen({ onSwitchToSignUp }: SignInScreenProps) {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startSSOFlow } = useSSO();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSignIn = async () => {
    if (!isLoaded || !signIn) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = useCallback(
    async (strategy: "oauth_google" | "oauth_apple") => {
      if (!startSSOFlow) return;

      setIsLoading(true);
      setError("");

      try {
        const { createdSessionId, setActive: ssoSetActive } = await startSSOFlow({
          strategy,
          redirectUrl: Linking.createURL("/oauth-callback"),
        });

        if (createdSessionId && ssoSetActive) {
          await ssoSetActive({ session: createdSessionId });
        }
      } catch (err: any) {
        setError(err.errors?.[0]?.message || "OAuth sign in failed");
      } finally {
        setIsLoading(false);
      }
    },
    [startSSOFlow]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to access your stretches</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#94a3b8"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!isLoading}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#94a3b8"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading}
        />

        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleEmailSignIn}
          disabled={isLoading || !email || !password}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>Sign In</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.oauthButtons}>
        <TouchableOpacity
          style={[styles.button, styles.oauthButton]}
          onPress={() => handleOAuthSignIn("oauth_google")}
          disabled={isLoading}
        >
          <Text style={styles.oauthButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        {Platform.OS === "ios" && (
          <TouchableOpacity
            style={[styles.button, styles.oauthButton, styles.appleButton]}
            onPress={() => handleOAuthSignIn("oauth_apple")}
            disabled={isLoading}
          >
            <Text style={[styles.oauthButtonText, styles.appleButtonText]}>
              Continue with Apple
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.switchButton} onPress={onSwitchToSignUp}>
        <Text style={styles.switchText}>
          Don't have an account? <Text style={styles.switchLink}>Sign up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#f8fafc",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 32,
  },
  error: {
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    padding: 12,
    borderRadius: 8,
    textAlign: "center",
    marginBottom: 16,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1a1a1a",
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#6366f1",
    marginTop: 8,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e2e8f0",
  },
  dividerText: {
    color: "#94a3b8",
    paddingHorizontal: 16,
    fontSize: 14,
  },
  oauthButtons: {
    gap: 12,
  },
  oauthButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  oauthButtonText: {
    color: "#1a1a1a",
    fontSize: 16,
    fontWeight: "500",
  },
  appleButton: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  appleButtonText: {
    color: "#fff",
  },
  switchButton: {
    marginTop: 32,
    alignItems: "center",
  },
  switchText: {
    fontSize: 14,
    color: "#64748b",
  },
  switchLink: {
    color: "#6366f1",
    fontWeight: "600",
  },
});
