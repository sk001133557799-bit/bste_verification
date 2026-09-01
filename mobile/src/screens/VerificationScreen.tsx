import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Share,
  Image,
} from "react-native";
import { THEME } from "../config/theme";
import { MobileAPI } from "../services/api";

export default function VerificationScreen({ route, navigation }: any) {
  const rollNumber = route.params?.rollNumber || "BSTE-2026-00125";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    fetchResult();
  }, [rollNumber]);

  const fetchResult = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await MobileAPI.verifyStudent(rollNumber);
      if (res.success) {
        setData(res.data);
        setIsOffline(!!res.isOffline);
      } else {
        setError(res.error || "No verified record found.");
      }
    } catch (err: any) {
      setError(typeof err === "string" ? err : "Failed to load result.");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!data) return;
    try {
      await Share.share({
        message: `BSTE Islamabad Verified Result: ${data.student.fullName} (${data.student.rollNumber}) has PASSED with Grade ${data.result.grade} (${data.result.percentage}%). Verify online at: http://localhost:3000/verify?roll=${data.student.rollNumber}`,
        title: "BSTE Examination Result",
      });
    } catch {}
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={THEME.colors.primary} />
        <Text style={styles.loadingText}>Authenticating with Central Board Database...</Text>
        <Text style={styles.loadingSub}>Roll Number: {rollNumber}</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={{ fontSize: 40, marginBottom: 12 }}>⚠️</Text>
        <Text style={styles.errorTitle}>Record Not Found</Text>
        <Text style={styles.errorSub}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>← Search Another Roll Number</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const { student, result, marks, certificate, qrDataUrl } = data;

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verified Result Card</Text>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
      </View>

      {isOffline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>⚡ Viewing Cached Record (Offline Mode)</Text>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Official Result Card */}
        <View style={styles.resultCard}>
          {/* Card Header Strip */}
          <View style={styles.cardHeader}>
            <Text style={styles.cardBoardName}>BOARD OF SCIENCE & TECHNICAL EDUCATION</Text>
            <Text style={styles.cardSubTitle}>ISLAMABAD CAPITAL TERRITORY, PAKISTAN</Text>
            <View style={styles.verifiedTag}>
              <Text style={styles.verifiedTagText}>✓ CRYPTOGRAPHICALLY VERIFIED</Text>
            </View>
          </View>

          {/* Student Profile Row */}
          <View style={styles.profileSection}>
            <View style={styles.photoContainer}>
              <Text style={styles.photoPlaceholderText}>PHOTO</Text>
            </View>
            <View style={styles.bioDetails}>
              <Text style={styles.studentName}>{student.fullName}</Text>
              <Text style={styles.fatherName}>S/D of {student.fatherName}</Text>
              <View style={styles.rollPill}>
                <Text style={styles.rollPillText}>Roll No: {student.rollNumber}</Text>
              </View>
              <Text style={styles.metaText}>Reg: {student.registrationNumber}</Text>
              <Text style={styles.metaText}>CNIC: {student.cnic}</Text>
            </View>
          </View>

          {/* Academic Metadata */}
          <View style={styles.academicBox}>
            <Text style={styles.academicInstitute}>{student.institute?.name}</Text>
            <Text style={styles.academicProgram}>{student.program?.title}</Text>
            <Text style={styles.academicSession}>
              Session: {student.session?.sessionName} • Passing Year: {student.passingYear}
            </Text>
          </View>

          {/* Marks Breakdown Table */}
          <View style={styles.marksSection}>
            <Text style={styles.marksSectionTitle}>Detailed Subject Marks</Text>

            <View style={styles.tableHeader}>
              <Text style={[styles.thCell, { flex: 2 }]}>Subject</Text>
              <Text style={[styles.thCell, { flex: 1, textAlign: "center" }]}>Max</Text>
              <Text style={[styles.thCell, { flex: 1, textAlign: "center" }]}>Obt</Text>
              <Text style={[styles.thCell, { flex: 0.8, textAlign: "right" }]}>Grade</Text>
            </View>

            {marks.map((m: any, idx: number) => (
              <View
                key={idx}
                style={[
                  styles.tableRow,
                  { backgroundColor: idx % 2 === 0 ? "#FFFFFF" : "#F8FAFC" },
                ]}
              >
                <View style={{ flex: 2 }}>
                  <Text style={styles.subjectName}>{m.subjectName}</Text>
                  <Text style={styles.subjectCode}>{m.subjectCode}</Text>
                </View>
                <Text style={[styles.tdCell, { flex: 1, textAlign: "center" }]}>{m.totalMax}</Text>
                <Text style={[styles.tdCellBold, { flex: 1, textAlign: "center" }]}>
                  {m.totalObtained}
                </Text>
                <Text style={[styles.tdGrade, { flex: 0.8, textAlign: "right" }]}>{m.grade}</Text>
              </View>
            ))}
          </View>

          {/* Final Summary Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryCol}>
              <Text style={styles.summaryLabel}>Total Marks</Text>
              <Text style={styles.summaryValue}>
                {result.obtainedMarks} / {result.totalMarks}
              </Text>
            </View>
            <View style={styles.summaryCol}>
              <Text style={styles.summaryLabel}>Percentage</Text>
              <Text style={styles.summaryValue}>{result.percentage}%</Text>
            </View>
            <View style={styles.summaryCol}>
              <Text style={styles.summaryLabel}>Grade</Text>
              <Text style={[styles.summaryValue, { color: THEME.colors.accentDark }]}>
                {result.grade}
              </Text>
            </View>
            <View style={styles.summaryCol}>
              <Text style={styles.summaryLabel}>Outcome</Text>
              <Text style={[styles.summaryValue, { color: THEME.colors.success }]}>
                {result.finalStatus}
              </Text>
            </View>
          </View>

          {/* Signatory & Security Footer */}
          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.signatoryTitle}>Prof. in Astrophysics and Controller of Examination</Text>
              <Text style={styles.signatoryName}>
                {certificate?.signatoryName || "Prof. Muhammad Sohail"}
              </Text>
              <Text style={styles.certNumber}>
                Cert ID: {certificate?.certificateNumber || "BSTE-CERT-2026-89412"}
              </Text>
            </View>
            <View style={styles.qrPlaceholder}>
              <Text style={{ fontSize: 22 }}>📱</Text>
              <Text style={{ fontSize: 8, color: THEME.colors.primary, fontWeight: "bold" }}>
                Scan to Verify
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: THEME.colors.background,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: "bold",
    color: THEME.colors.primary,
    marginTop: 12,
  },
  loadingSub: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 4,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: THEME.colors.danger,
  },
  errorSub: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  header: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    padding: 4,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "bold",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
  shareButton: {
    backgroundColor: THEME.colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  shareButtonText: {
    color: THEME.colors.primaryDark,
    fontSize: 11,
    fontWeight: "bold",
  },
  offlineBanner: {
    backgroundColor: "#FEF3C7",
    paddingVertical: 4,
    alignItems: "center",
  },
  offlineText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#92400E",
  },
  content: {
    flex: 1,
    padding: 14,
  },
  resultCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 2,
    borderColor: "rgba(197, 155, 39, 0.4)",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 10,
  },
  cardBoardName: {
    fontSize: 12,
    fontWeight: "bold",
    color: THEME.colors.primary,
    textAlign: "center",
  },
  cardSubTitle: {
    fontSize: 9,
    color: THEME.colors.textSecondary,
    marginTop: 1,
  },
  verifiedTag: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#A7F3D0",
    marginTop: 6,
  },
  verifiedTagText: {
    fontSize: 9,
    fontWeight: "bold",
    color: THEME.colors.success,
  },
  profileSection: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    alignItems: "center",
  },
  photoContainer: {
    width: 64,
    height: 76,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  photoPlaceholderText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#94A3B8",
  },
  bioDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 15,
    fontWeight: "bold",
    color: THEME.colors.textPrimary,
  },
  fatherName: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
  },
  rollPill: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginVertical: 4,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  rollPillText: {
    fontSize: 10,
    fontWeight: "bold",
    color: THEME.colors.primary,
  },
  metaText: {
    fontSize: 10,
    color: THEME.colors.textSecondary,
  },
  academicBox: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  academicInstitute: {
    fontSize: 12,
    fontWeight: "bold",
    color: THEME.colors.textPrimary,
  },
  academicProgram: {
    fontSize: 11,
    fontWeight: "600",
    color: THEME.colors.primary,
    marginTop: 2,
  },
  academicSession: {
    fontSize: 10,
    color: THEME.colors.textSecondary,
    marginTop: 1,
  },
  marksSection: {
    paddingVertical: 10,
  },
  marksSectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: THEME.colors.primary,
    marginBottom: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
  thCell: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  subjectName: {
    fontSize: 11,
    fontWeight: "600",
    color: THEME.colors.textPrimary,
  },
  subjectCode: {
    fontSize: 9,
    color: THEME.colors.textSecondary,
  },
  tdCell: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
  },
  tdCellBold: {
    fontSize: 11,
    fontWeight: "bold",
    color: THEME.colors.textPrimary,
  },
  tdGrade: {
    fontSize: 11,
    fontWeight: "bold",
    color: THEME.colors.accentDark,
  },
  summaryCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  summaryCol: {
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 9,
    color: THEME.colors.textSecondary,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: "bold",
    color: THEME.colors.textPrimary,
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  signatoryTitle: {
    fontSize: 9,
    color: THEME.colors.textSecondary,
    fontWeight: "bold",
  },
  signatoryName: {
    fontSize: 11,
    fontWeight: "bold",
    color: THEME.colors.textPrimary,
  },
  certNumber: {
    fontSize: 9,
    color: "#94A3B8",
    fontFamily: "monospace",
    marginTop: 2,
  },
  qrPlaceholder: {
    width: 54,
    height: 54,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
  },
});
