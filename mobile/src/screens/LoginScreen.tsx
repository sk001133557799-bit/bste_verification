import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { THEME } from "../config/theme";
import { MobileAPI } from "../services/api";

export default function LoginScreen({ navigation }: any) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!identifier.trim() || !password.trim()) {
      setError("Please enter your official email/username and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await MobileAPI.login(identifier.trim(), password);
      if (res.success && res.data?.user) {
        const role = res.data.user.role;
        if (role === "SUPER_ADMIN" || role === "ADMIN") {
          navigation.replace("AdminDashboard");
        } else {
          navigation.replace("TeacherDashboard");
        }
      } else {
        setError(res.error || "Authentication failed.");
      }
    } catch (err: any) {
      setError(typeof err === "string" ? err : "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inner}
      >
        {/* Header Branding */}
        <View style={styles.brandBox}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>BSTE</Text>
          </View>
          <Text style={styles.boardTitle}>Board of Science &amp; Technical Education</Text>
          <Text style={styles.portalSub}>Official Faculty &amp; Staff Mobile Portal</Text>
        </View>

        {/* Login Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Authorized Staff Sign In</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          ) : null}

          <View style={styles.field}>
            <Text style={styles.label}>Email or Username</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. officer@bste.edu.pk"
              placeholderTextColor="#94A3B8"
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={THEME.colors.primaryDark} />
            ) : (
              <Text style={styles.submitBtnText}>Sign In to Console</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.primary,
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  brandBox: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: THEME.colors.primaryDark,
    borderWidth: 2,
    borderColor: THEME.colors.accent,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  logoText: {
    color: THEME.colors.accent,
    fontWeight: "bold",
    fontSize: 14,
  },
  boardTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  portalSub: {
    color: THEME.colors.accentLight,
    fontSize: 12,
    marginTop: 2,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: THEME.colors.textPrimary,
    marginBottom: 16,
  },
  errorBox: {
    backgroundColor: "#FEF2F2",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorText: {
    color: THEME.colors.danger,
    fontSize: 11,
    fontWeight: "bold",
  },
  field: {
    marginBottom: 14,
  },
  label: {
    fontSize: 11,
    fontWeight: "bold",
    color: THEME.colors.textSecondary,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: THEME.colors.textPrimary,
  },
  submitBtn: {
    backgroundColor: THEME.colors.accent,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  submitBtnText: {
    color: THEME.colors.primaryDark,
    fontSize: 13,
    fontWeight: "bold",
  },
});
