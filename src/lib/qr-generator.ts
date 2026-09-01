import crypto from "crypto";
import QRCode from "qrcode";

const VERIFICATION_SECRET = process.env.JWT_SECRET || "bste_verification_secret_salt";

/**
 * Generate a cryptographic checksum for a certificate record
 */
export function generateSecurityHash(studentRoll: string, certNumber: string, passingYear: number): string {
  const data = `${studentRoll}|${certNumber}|${passingYear}|${VERIFICATION_SECRET}`;
  return crypto.createHash("sha256").update(data).digest("hex").substring(0, 16).toUpperCase();
}

/**
 * Build absolute public verification URL for QR codes and certificate links
 */
export function buildVerificationUrl(certNumber: string): string {
  let baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
  if (!baseUrl && process.env.VERCEL_URL) {
    baseUrl = `https://${process.env.VERCEL_URL}`;
  }
  if (!baseUrl) {
    baseUrl = typeof window !== "undefined" && window.location?.origin ? window.location.origin : "https://bste-islamabad.edu.pk";
  }
  return `${baseUrl.replace(/\/$/, "")}/verify/${encodeURIComponent(certNumber)}`;
}

/**
 * Generate Base64 Data URL for a QR Code
 */
export async function generateQrDataUrl(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 280,
      color: {
        dark: "#0B2545", // Navy color for official stamp
        light: "#FFFFFF",
      },
    });
  } catch (err) {
    console.error("QR Code generation error:", err);
    return "";
  }
}

/**
 * Generate full QR data URL from certificate ID
 */
export async function generateVerificationQR(certNumber: string): Promise<string> {
  const url = buildVerificationUrl(certNumber);
  return await generateQrDataUrl(url);
}
