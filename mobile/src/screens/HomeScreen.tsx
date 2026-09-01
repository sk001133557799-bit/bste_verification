import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  Image,
} from "react-native";
import { THEME } from "../config/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ navigation }: any) {
  const [rollNumber, setRollNumber] = useState("");
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRecentSearches();
    loadAnnouncements();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const raw = await AsyncStorage.getItem("@recent_searches");
      if (raw) setRecentSearches(JSON.parse(raw));
    } catch {}
  };

  const loadAnnouncements = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/mobile/notifications");
      const json = await res.json();
      if (json.success) setAnnouncements(json.data.slice(0, 3));
    } catch {}
  };

  const handleSearch = () => {
    if (!rollNumber.trim()) return;
    navigation.navigate("Verification", { rollNumber: rollNumber.trim().toUpperCase() });
  };

  const samplePills = ["BSTE-2026-00125", "BSTE-2026-00126", "BSTE-2026-00127"];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.primary} />

      {/* Top Board Bar */}
      <View style={styles.topBar}>
        <View style={styles.emblemWrapper}>
          <Text style={styles.emblemText}>BSTE</Text>
        </View>
        <View style={styles.topTitleWrapper}>
          <Text style={styles.topGovtText}>GOVERNMENT OF PAKISTAN</Text>
          <Text style={styles.topBoardTitle}>Board of Science & Technical Education</Text>
          <Text style={styles.topBoardSub}>Islamabad Capital Territory</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Breaking News Ticker */}
        <View style={styles.tickerCard}>
          <View style={styles.tickerBadge}>
            <Text style={styles.tickerBadgeText}>GAZETTE</Text>
          </View>
          <Text style={styles.tickerText} numberOfLines={1}>
            Annual Examination 2026 Diploma Results Published Online
          </Text>
        </View>

        {/* Hero Search Box */}
        <View style={styles.searchCard}>
          <Text style={styles.searchCardTitle}>Instant Result Verification</Text>
          <Text style={styles.searchCardSub}>
            Enter candidate roll number to view and download official verified transcript.
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="e.g. BSTE-2026-00125"
              placeholderTextColor="#94A3B8"
              value={rollNumber}
              onChangeText={setRollNumber}
              autoCapitalize="characters"
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>Verify Result</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pillsRow}>
            <Text style={styles.pillsLabel}>Official Format: BSTE-YYYY-XXXXX</Text>
          </View>
        </View>

        {/* Action Grid */}
        <View style={styles.grid}>
          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => navigation.navigate("QRScanner")}
          >
            <View style={[styles.iconCircle, { backgroundColor: "#ECFDF5" }]}>
              <Text style={{ fontSize: 24 }}>📷</Text>
            </View>
            <Text style={styles.gridTitle}>Scan QR Seal</Text>
            <Text style={styles.gridSub}>Camera verification</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => navigation.navigate("Notifications")}
          >
            <View style={[styles.iconCircle, { backgroundColor: "#FEF3C7" }]}>
              <Text style={{ fontSize: 24 }}>📢</Text>
            </View>
            <Text style={styles.gridTitle}>Gazettes</Text>
            <Text style={styles.gridSub}>Circulars & dates</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Search History */}
        {recentSearches.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Result Lookups</Text>
            {recentSearches.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.recentItem}
                onPress={() => navigation.navigate("Verification", { rollNumber: item.rollNumber })}
              >
                <View>
                  <Text style={styles.recentRoll}>{item.rollNumber}</Text>
                  <Text style={styles.recentName}>{item.studentName}</Text>
                </View>
                <Text style={styles.recentArrow}>→</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Latest Announcements */}
        {announcements.length > 0 && (
          <View style={[styles.section, { marginBottom: 40 }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Official Announcements</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
                <Text style={styles.seeAllText}>See All →</Text>
              </TouchableOpacity>
            </View>
            {announcements.map((item) => (
              <View key={item.id} style={styles.noticeCard}>
                <Text style={styles.noticeCategory}>{item.category.replace("_", " ")}</Text>
                <Text style={styles.noticeTitle}>{item.title}</Text>
                <Text style={styles.noticeContent} numberOfLines={2}>
                  {item.content}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  topBar: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: THEME.colors.accent,
  },
  emblemWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.colors.primaryDark,
    borderWidth: 2,
    borderColor: THEME.colors.accent,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  emblemText: {
    color: THEME.colors.accent,
    fontWeight: "bold",
    fontSize: 10,
  },
  topTitleWrapper: {
    flex: 1,
  },
  topGovtText: {
    color: THEME.colors.accent,
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  topBoardTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  topBoardSub: {
    color: "#94A3B8",
    fontSize: 10,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  tickerCard: {
    backgroundColor: "#FEF3C7",
    padding: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  tickerBadge: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  tickerBadgeText: {
    color: THEME.colors.accent,
    fontSize: 9,
    fontWeight: "bold",
  },
  tickerText: {
    color: THEME.colors.primary,
    fontSize: 11,
    fontWeight: "600",
    flex: 1,
  },
  searchCard: {
    backgroundColor: THEME.colors.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(197, 155, 39, 0.4)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  searchCardTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  searchCardSub: {
    color: "#CBD5E1",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    fontWeight: "600",
    color: THEME.colors.textPrimary,
  },
  searchButton: {
    backgroundColor: THEME.colors.accent,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonText: {
    color: THEME.colors.primaryDark,
    fontSize: 12,
    fontWeight: "bold",
  },
  pillsRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 14,
  },
  pillsLabel: {
    color: "#94A3B8",
    fontSize: 10,
    fontWeight: "bold",
  },
  pill: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  pillText: {
    color: THEME.colors.accentLight,
    fontSize: 10,
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  gridCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    alignItems: "center",
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  gridTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: THEME.colors.textPrimary,
  },
  gridSub: {
    fontSize: 10,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: THEME.colors.primary,
    marginBottom: 10,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: "bold",
    color: THEME.colors.accentDark,
  },
  recentItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
  },
  recentRoll: {
    fontSize: 13,
    fontWeight: "bold",
    color: THEME.colors.primary,
  },
  recentName: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  recentArrow: {
    fontSize: 16,
    color: THEME.colors.accent,
    fontWeight: "bold",
  },
  noticeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
  },
  noticeCategory: {
    fontSize: 9,
    fontWeight: "bold",
    color: THEME.colors.accentDark,
    textTransform: "uppercase",
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: THEME.colors.textPrimary,
    marginVertical: 4,
  },
  noticeContent: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    lineHeight: 16,
  },
});
