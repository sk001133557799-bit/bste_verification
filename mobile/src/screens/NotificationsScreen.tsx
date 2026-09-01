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

export default function NotificationsScreen({ navigation }: any) {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState("ALL");

  const categories = [
    { id: "ALL", label: "All" },
    { id: "RESULT_DECLARATION", label: "Results" },
    { id: "EXAM_DATE", label: "Date Sheets" },
    { id: "ADMISSION", label: "Admissions" },
    { id: "NOTIFICATION", label: "Circulars" },
  ];

  const fetchNotices = async () => {
    try {
      const res = await MobileAPI.getNotifications(activeCategory);
      if (res.data) setAnnouncements(res.data);
    } catch {} finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [activeCategory]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotices();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Official Gazette &amp; Circulars</Text>
      </View>

      {/* Category Filter Tabs */}
      <View style={styles.tabBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabContent}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.tabPill,
                activeCategory === cat.id && styles.activeTabPill,
              ]}
              onPress={() => setActiveCategory(cat.id)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeCategory === cat.id && styles.activeTabText,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={THEME.colors.primary} />
          <Text style={styles.loadingText}>Loading Circulars...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
        >
          {announcements.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View
                  style={[
                    styles.badge,
                    item.category === "RESULT_DECLARATION"
                      ? { backgroundColor: "#ECFDF5" }
                      : item.category === "EXAM_DATE"
                      ? { backgroundColor: "#FFFBEB" }
                      : { backgroundColor: "#EFF6FF" },
                  ]}
                >
                  <Text style={styles.badgeText}>{item.category.replace("_", " ")}</Text>
                </View>
                <Text style={styles.dateText}>
                  {new Date(item.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
              </View>

              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.body}>{item.content}</Text>
            </View>
          ))}
          <View style={{ height: 40 }} />
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
    paddingVertical: 14,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  tabBar: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.cardBorder,
    paddingVertical: 8,
  },
  tabContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  tabPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
  },
  activeTabPill: {
    backgroundColor: THEME.colors.primary,
  },
  tabText: {
    fontSize: 11,
    fontWeight: "bold",
    color: THEME.colors.textSecondary,
  },
  activeTabText: {
    color: THEME.colors.accentLight,
  },
  content: {
    flex: 1,
    padding: 14,
  },
  centerBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 12,
    fontWeight: "bold",
    color: THEME.colors.primary,
    marginTop: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "bold",
    color: THEME.colors.primary,
    textTransform: "uppercase",
  },
  dateText: {
    fontSize: 10,
    color: "#94A3B8",
    fontFamily: "monospace",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: THEME.colors.textPrimary,
    marginBottom: 6,
    lineHeight: 18,
  },
  body: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    lineHeight: 18,
  },
});
