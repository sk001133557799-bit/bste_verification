import { StudentResultData } from "@/components/public/ResultCard";

/**
 * Generates and triggers the download of an Official BSTE Result Certificate PDF.
 * Uses high-DPI canvas capture with jsPDF fallback for crisp, print-ready output.
 */
export async function generateOfficialResultPdf(
  element: HTMLElement,
  data: StudentResultData
): Promise<void> {
  const html2canvas = (await import("html2canvas")).default;
  const { jsPDF } = await import("jspdf");

  // Ensure high-DPI scaling for vector-like clarity
  const canvas = await html2canvas(element, {
    scale: 2.5,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
    windowWidth: 1200,
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.98);

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // A4 Dimensions (210mm x 297mm)
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 5;
  const contentWidth = pageWidth - margin * 2;
  const contentHeight = (canvas.height * contentWidth) / canvas.width;

  // Add certificate image
  pdf.addImage(
    imgData,
    "JPEG",
    margin,
    margin,
    contentWidth,
    Math.min(contentHeight, pageHeight - margin * 2),
    undefined,
    "FAST"
  );

  // Set document metadata
  pdf.setProperties({
    title: `BSTE Official Result Certificate - ${data.student.rollNumber}`,
    subject: `Academic Result Transcript for ${data.student.fullName} (${data.student.className})`,
    author: "Board of Science & Technical Education Islamabad",
    keywords: `BSTE, Result, Transcript, ${data.student.rollNumber}, ${data.result.verificationId}`,
    creator: "BSTE Central Cryptographic Verification System",
  });

  // Trigger file download
  const cleanRoll = data.student.rollNumber.replace(/[^a-zA-Z0-9_-]/g, "_");
  pdf.save(`BSTE_Official_Result_Certificate_${cleanRoll}.pdf`);
}
