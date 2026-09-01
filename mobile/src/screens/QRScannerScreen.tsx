import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Modal,
} from "react-native";
import { THEME } from "../config/theme";
import { MobileAPI } from "../services/api";

export default function QRScannerScreen({ navigation }: any) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(true);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [manualCertId, setManualCertId] = useState("");

  const handleBarCodeScanned = async (data: string) => {
    if (scanned || loading) return;
    setScanned(true);
    setLoading(true);

    try {
      // Extract Certificate ID from URL or raw text
      let certId = data.trim();
      if (certId.includes("/verify/")) {
        certId = certId.split("/verify/")[1].split("?")[0];
      }

      const res = await MobileAPI.verifyCertificate(certId);
      setVerificationResult(res);
    } catch (err: any) {
      setVerificationResult({
        success: false,
        error: typeof err === "string" ? err : "Certificate not recognized.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Demo scan simulation
  const simulateScan = () => {
    handleBarCodeScanned("http://localhost:3000/verify/BSTE-CERT-2026-89412");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>✕ Close</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Certificate QR</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Viewfinder Box */}
      <View style={styles.cameraBox}>
        <View style={styles.viewfinder}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />

          {loading ? (
            <ActivityIndicator size="large" color={THEME.colors.accent} />
          ) : (
            <Text style={styles.scanInstruction}>
              Align certificate QR code within this viewfinder
            </Text>
          )}
        </View>

        <Text style={{ color: "#94A3B8", fontSize: 11, marginTop: 24, textAlign: "center" }}>
          Position camera over QR seal on BSTE Diploma or Result Transcript.
        </Text>
      </View>

      {/* Result Modal */}
      <Modal visible={!!verificationResult} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {verificationResult?.success ? (
              <View style={styles.modalInner}>
                <Text style={{ fontSize: 44, marginBottom: 8 }}>✅</Text>
                <Text style={styles.modalSuccessTitle}>VERIFIED AUTHENTIC</Text>
                <Text style={styles.modalSuccessSub}>
                  Official BSTE Islamabad Cryptographic Credential
                </Text>

                <View style={styles.certDetailsBox}>
                  <Text style={styles.detailLabel}>Candidate Name:</Text>
                  <Text style={styles.detailValue}>
                    {verificationResult.data.student.fullName}
                  </Text>

                  <Text style={styles.detailLabel}>Program:</Text>
                  <Text style={styles.detailValue}>
                    {verificationResult.data.student.program}
                  </Text>

                  <Text style={styles.detailLabel}>Certificate ID:</Text>
                  <Text style={styles.detailValueBold}>
                    {verificationResult.data.certificateNumber}
                  </Text>

                  <Text style={styles.detailLabel}>Result Status:</Text>
                  <Text style={[styles.detailValueBold, { color: THEME.colors.success }]}>
                    {verificationResult.data.result.finalStatus} (Grade {verificationResult.data.result.grade})
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.viewFullButton}
                  onPress={() => {
                    const roll = verificationResult.data.student.rollNumber;
                    setVerificationResult(null);
                    setScanned(false);
                    navigation.navigate("Verification", { rollNumber: roll });
                  }}
                >
                  <Text style={styles.viewFullButtonText}>View Complete Result Card →</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.modalInner}>
                <Text style={{ fontSize: 44, marginBottom: 8 }}>❌</Text>
                <Text style={styles.modalErrorTitle}>INVALID CERTIFICATE</Text>
                <Text style={styles.modalErrorSub}>
                  {verificationResult?.error || "This document could not be verified."}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => {
                setVerificationResult(null);
                setScanned(false);
              }}
            >
              <Text style={styles.closeModalText}>Close &amp; Scan Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.primaryDark,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 6,
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
  cameraBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  viewfinder: {
    width: 250,
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 36,
    height: 36,
    borderColor: THEME.colors.accent,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  scanInstruction: {
    color: "#CBD5E1",
    fontSize: 11,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  demoScanButton: {
    backgroundColor: THEME.colors.primaryLight,
    borderWidth: 1,
    borderColor: THEME.colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 40,
  },
  demoScanText: {
    color: THEME.colors.accentLight,
    fontSize: 12,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 360,
  },
  modalInner: {
    alignItems: "center",
  },
  modalSuccessTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: THEME.colors.success,
  },
  modalSuccessSub: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    textAlign: "center",
    marginBottom: 16,
  },
  modalErrorTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: THEME.colors.danger,
  },
  modalErrorSub: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    textAlign: "center",
    marginBottom: 16,
  },
  certDetailsBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 14,
    width: "100%",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 10,
    color: THEME.colors.textSecondary,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginTop: 6,
  },
  detailValue: {
    fontSize: 13,
    color: THEME.colors.textPrimary,
    fontWeight: "600",
  },
  detailValueBold: {
    fontSize: 13,
    color: THEME.colors.primary,
    fontWeight: "bold",
  },
  viewFullButton: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  viewFullButtonText: {
    color: THEME.colors.accentLight,
    fontSize: 13,
    fontWeight: "bold",
  },
  closeModalButton: {
    paddingVertical: 10,
    alignItems: "center",
  },
  closeModalText: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: "bold",
  },
});
