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

export default function AdminDashboardScreen({ navigation }: any) {
  const [data, setData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadProfileAndDashboard = async () => {
    try {
      const rawUser = await AsyncStorage.getItem("@bste_user_profile");
      if (rawUser) setUser(JSON.parse(rawUser));

      const res = await MobileAPI.getAdminDashboard();
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
          <Text style={styles.headerRole}>Executive Board Administration</Text>
          <Text style={styles.headerName}>{user?.fullName || "Board Administrator"}</Text>
          <Text style={styles.headerDept}>Central Examination Controller Console</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={THEME.colors.primary} />
          <Text style={styles.loadingText}>Loading Board Analytics...</Text>
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
          {/* Executive Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Total Students</Text>
              <Text style={styles.statVal}>{data?.stats?.totalStudents || 0}</Text>
              <Text style={styles.statSub}>Indexed Ledger</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Pass Percentage</Text>
              <Text style={[styles.statVal, { color: THEME.colors.success }]}>
                {data?.stats?.passRate || 100}%
              </Text>
              <Text style={styles.statSub}>Board Pass Rate</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Faculty</Text>
              <Text style={styles.statVal}>{data?.stats?.totalTeachers || 0}</Text>
              <Text style={styles.statSub}>Instructors</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Institutes</Text>
              <Text style={styles.statVal}>{data?.stats?.totalInstitutes || 0}</Text>
              <Text style={styles.statSub}>Polytechnics</Text>
            </View>
          </View>

          {/* Pending Approvals Review Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Pending Review Queue ({data?.stats?.pendingApprovals || 0})
              </Text>
            </View>

            {data?.pendingSubmissions?.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={{ fontSize: 24, marginBottom: 4 }}>✓</Text>
                <Text style={styles.emptyTitle}>Approvals Queue Clean</Text>
                <Text style={styles.emptySub}>All batch marks submissions have been processed.</Text>
              </View>
            ) : (
              data?.pendingSubmissions?.map((sub: any) => (
                <View key={sub.id} style={styles.submissionCard}>
                  <View style={styles.submissionTop}>
                    <Text style={styles.submissionTitle}>{sub.title}</Text>
                    <View style={styles.pendingBadge}>
                      <Text style={styles.pendingBadgeText}>PENDING</Text>
                    </View>
                  </View>
                  <Text style={styles.submissionMeta}>
                    {sub.institute?.name} • {sub.program?.code}
                  </Text>
                  <Text style={styles.submissionTeacher}>
                    Evaluator: {sub.teacher?.user?.fullName || "Faculty Member"}
                  </Text>
                </View>
              ))
            )}
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
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  statBox: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
  },
  statLabel: {
    fontSize: 10,
    color: THEME.colors.textSecondary,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  statVal: {
    fontSize: 22,
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: THEME.colors.primary,
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: THEME.colors.success,
  },
  emptySub: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  submissionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
  },
  submissionTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  submissionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: THEME.colors.textPrimary,
    flex: 1,
  },
  pendingBadge: {
    backgroundColor: "#FFFBEB",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  pendingBadgeText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#B45309",
  },
  submissionMeta: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
  },
  submissionTeacher: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 2,
  },
});
