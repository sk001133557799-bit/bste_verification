import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Mask CNIC for public student result privacy
 * Example: "61101-1234567-3" => "61101-*******-3"
 */
export function maskCNIC(cnic?: string | null): string {
  if (!cnic) return "N/A";
  const clean = cnic.trim();
  const parts = clean.split("-");
  if (parts.length === 3) {
    return `${parts[0]}-*******-${parts[2]}`;
  }
  if (clean.length === 13) {
    return `${clean.substring(0, 5)}-*******-${clean.substring(12)}`;
  }
  return clean.replace(/^(\d{5})\d+(\d{1})$/, "$1-*******-$2");
}

/**
 * Standard BSTE Grading Scale (BISE / Technical Board Criteria)
 */
export function calculateGrade(percentage: number): {
  grade: string;
  remarks: string;
  gpa: number;
} {
  if (percentage >= 80) return { grade: "A+", remarks: "Outstanding / Exceptional", gpa: 4.0 };
  if (percentage >= 70) return { grade: "A", remarks: "Excellent", gpa: 3.7 };
  if (percentage >= 60) return { grade: "B", remarks: "Very Good", gpa: 3.0 };
  if (percentage >= 50) return { grade: "C", remarks: "Good / Satisfactory", gpa: 2.5 };
  if (percentage >= 40) return { grade: "D", remarks: "Fair / Pass", gpa: 2.0 };
  if (percentage >= 33) return { grade: "E", remarks: "Pass (Marginal)", gpa: 1.0 };
  return { grade: "F", remarks: "Fail", gpa: 0.0 };
}

/**
 * Formats a Date to Pakistani Official Board Date Format
 * Example: "25 August 2026"
 */
export function formatOfficialDate(date: string | Date | null | undefined): string {
  if (!date) return "N/A";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "N/A";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
}

/**
 * Generate Secure Certificate Number
 * Example: "BSTE-CERT-2026-89412"
 */
export function generateCertNumber(year = 2026, idNum = 1): string {
  const padded = String(idNum).padStart(5, "0");
  return `BSTE-CERT-${year}-${padded}`;
}
