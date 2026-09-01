import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { THEME } from "../config/theme";
import { MobileAPI } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TeacherDashboardScreen({ navigation }: any) {
  const [data, setData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadProfileAndDashboard = async () => {
    try {
      const rawUser = await AsyncStorage.getItem("@bste_user_profile");
      if (rawUser) setUser(JSON.parse(rawUser));

      const res = await MobileAPI.getTeacherDashboard();
      if (res.success) setData(res.data);
    } catch {} finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProfileAndDashboard();
  }, []);

  const handleLogout = async () => {
    await MobileAPI.logout();
    navigation.replace("Home");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerRole}>Instructor Portal</Text>
          <Text style={styles.headerName}>{user?.fullName || "Engr. Bilal Ahmad"}</Text>
          <Text style={styles.headerDept}>{user?.institute || "Islamabad Institute of Technology"}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={THEME.colors.primary} />
          <Text style={styles.loadingText}>Loading Faculty Console...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadProfileAndDashboard();
              }}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* 3 Metric Cards */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Assigned</Text>
              <Text style={styles.statValue}>{data?.stats?.totalStudents || 0}</Text>
              <Text style={styles.statSub}>Candidates</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Pending</Text>
              <Text style={[styles.statValue, { color: THEME.colors.warning }]}>
                {data?.stats?.pendingSubmissions || 0}
              </Text>
              <Text style={styles.statSub}>In Review</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Approved</Text>
              <Text style={[styles.statValue, { color: THEME.colors.success }]}>
                {data?.stats?.approvedSubmissions || 0}
              </Text>
              <Text style={styles.statSub}>Published</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Examination Operations</Text>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => alert("Open Web Portal at http://localhost:3000/portal/teacher/single-entry for advanced single candidate marks entry.")}
            >
              <View style={styles.actionIconBox}>
                <Text style={{ fontSize: 20 }}>📝</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.actionTitle}>Single Student Entry</Text>
                <Text style={styles.actionSub}>Register student and enter subject marks</Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => alert("Open Web Portal at http://localhost:3000/portal/teacher/bulk-upload for batch Excel imports.")}
            >
              <View style={[styles.actionIconBox, { backgroundColor: "#ECFDF5" }]}>
                <Text style={{ fontSize: 20 }}>📊</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.actionTitle}>Excel Bulk Upload</Text>
                <Text style={styles.actionSub}>Import class batch with marks validator</Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Candidates List */}
          <View style={[styles.section, { marginBottom: 30 }]}>
            <Text style={styles.sectionTitle}>Recent Departmental Candidates</Text>
            {data?.recentStudents?.map((s: any) => (
              <View key={s.id} style={styles.studentItem}>
                <View>
                  <Text style={styles.studentName}>{s.fullName}</Text>
                  <Text style={styles.studentRoll}>Roll: {s.rollNumber} • {s.program?.code}</Text>
                </View>
                <View style={styles.gradeBadge}>
                  <Text style={styles.gradeText}>
                    {s.results?.[0]?.grade || "PENDING"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: THEME.colors.accent,
  },
  headerRole: {
    color: THEME.colors.accent,
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  headerName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 2,
  },
  headerDept: {
    color: "#94A3B8",
    fontSize: 11,
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: "rgba(220, 38, 38, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(220, 38, 38, 0.4)",
  },
  logoutText: {
    color: "#FCA5A5",
    fontSize: 11,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  centerBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 13,
    fontWeight: "bold",
    color: THEME.colors.primary,
    marginTop: 10,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 10,
    color: THEME.colors.textSecondary,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: THEME.colors.primary,
    marginVertical: 2,
  },
  statSub: {
    fontSize: 9,
    color: "#94A3B8",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: THEME.colors.primary,
    marginBottom: 10,
  },
  actionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
  },
  actionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: THEME.colors.textPrimary,
  },
  actionSub: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  actionArrow: {
    fontSize: 16,
    color: THEME.colors.accent,
    fontWeight: "bold",
  },
  studentItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
  },
  studentName: {
    fontSize: 13,
    fontWeight: "bold",
    color: THEME.colors.textPrimary,
  },
  studentRoll: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  gradeBadge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  gradeText: {
    fontSize: 11,
    fontWeight: "bold",
    color: THEME.colors.primary,
  },
});
