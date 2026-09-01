import * as XLSX from "xlsx";
import { calculateGrade } from "./utils";

export interface ParsedSubjectMark {
  subjectCode: string;
  theoryObtained: number;
  practicalObtained: number;
  theoryMax: number;
  practicalMax: number;
}

export interface ParsedStudentRecord {
  rowNumber: number;
  rollNumber: string;
  registrationNumber: string;
  fullName: string;
  fatherName: string;
  cnic: string;
  gender: string;
  dob?: string;
  contactNo?: string;
  subjects: ParsedSubjectMark[];
  totalMaxMarks: number;
  totalObtainedMarks: number;
  percentage: number;
  grade: string;
  status: "PASSED" | "FAILED" | "COMPARTMENT";
  isValid: boolean;
  errors: string[];
}

export interface ExcelValidationResult {
  success: boolean;
  totalRows: number;
  validCount: number;
  errorCount: number;
  records: ParsedStudentRecord[];
  errors: { row: number; column: string; message: string }[];
}

/**
 * Validate and parse Excel buffer for bulk student mark imports
 */
export function validateAndParseExcel(
  buffer: Buffer | ArrayBuffer,
  expectedSubjects: { code: string; name: string; theoryMax: number; practicalMax: number }[]
): ExcelValidationResult {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  // Parse rows as array of objects
  const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

  const records: ParsedStudentRecord[] = [];
  const errors: { row: number; column: string; message: string }[] = [];
  const seenRolls = new Set<string>();

  rawRows.forEach((row, index) => {
    const rowNum = index + 2; // +2 considering Excel 1-based index and header row
    const rowErrors: string[] = [];

    // Extract basic fields (case-insensitive keys)
    const getVal = (possibleKeys: string[]) => {
      for (const k of Object.keys(row)) {
        const cleanK = k.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
        for (const pk of possibleKeys) {
          if (cleanK === pk.toLowerCase().replace(/[^a-z0-9]/g, "")) {
            return String(row[k]).trim();
          }
        }
      }
      return "";
    };

    const rollNumber = getVal(["Roll Number", "RollNo", "Roll_No", "Roll"]);
    const registrationNumber = getVal(["Registration Number", "RegNo", "Registration", "Reg_No"]);
    const fullName = getVal(["Student Name", "Name", "FullName", "Full_Name"]);
    const fatherName = getVal(["Father Name", "FatherName", "Father_Name"]);
    const cnic = getVal(["CNIC", "CNIC Number", "B-Form", "Student CNIC"]);
    const gender = getVal(["Gender", "Sex"]) || "Male";
    const dob = getVal(["Date of Birth", "DOB", "BirthDate"]);
    const contactNo = getVal(["Contact Number", "Phone", "Mobile", "Contact"]);

    if (!rollNumber) {
      rowErrors.push("Roll Number is required");
      errors.push({ row: rowNum, column: "Roll Number", message: "Roll Number cannot be empty" });
    } else if (seenRolls.has(rollNumber)) {
      rowErrors.push(`Duplicate Roll Number in file: ${rollNumber}`);
      errors.push({ row: rowNum, column: "Roll Number", message: "Duplicate Roll Number found in uploaded file" });
    } else {
      seenRolls.add(rollNumber);
    }

    if (!registrationNumber) {
      rowErrors.push("Registration Number is required");
      errors.push({ row: rowNum, column: "Registration Number", message: "Registration Number cannot be empty" });
    }

    if (!fullName) {
      rowErrors.push("Student Name is required");
      errors.push({ row: rowNum, column: "Student Name", message: "Student Name is required" });
    }

    if (!fatherName) {
      rowErrors.push("Father Name is required");
      errors.push({ row: rowNum, column: "Father Name", message: "Father Name is required" });
    }

    if (!cnic) {
      rowErrors.push("CNIC is required");
      errors.push({ row: rowNum, column: "CNIC", message: "CNIC is required" });
    }

    // Parse subject marks
    const parsedSubjects: ParsedSubjectMark[] = [];
    let totalMax = 0;
    let totalObtained = 0;
    let hasFailedSubject = false;

    expectedSubjects.forEach((subj) => {
      const theoryKey = getVal([
        `${subj.code}_Theory`,
        `${subj.code} Theory`,
        `${subj.code}_Th`,
        `${subj.code} Th`,
      ]);
      const practicalKey = getVal([
        `${subj.code}_Practical`,
        `${subj.code} Practical`,
        `${subj.code}_Pr`,
        `${subj.code} Pr`,
      ]);

      const theoryObtained = theoryKey !== "" ? Number(theoryKey) : 0;
      const practicalObtained = practicalKey !== "" ? Number(practicalKey) : 0;

      if (isNaN(theoryObtained) || theoryObtained < 0 || theoryObtained > subj.theoryMax) {
        rowErrors.push(`${subj.code} Theory mark (${theoryObtained}) exceeds max limit (${subj.theoryMax}) or is invalid`);
        errors.push({
          row: rowNum,
          column: `${subj.code} Theory`,
          message: `Marks must be between 0 and ${subj.theoryMax}`,
        });
      }

      if (isNaN(practicalObtained) || practicalObtained < 0 || practicalObtained > subj.practicalMax) {
        rowErrors.push(`${subj.code} Practical mark (${practicalObtained}) exceeds max limit (${subj.practicalMax}) or is invalid`);
        errors.push({
          row: rowNum,
          column: `${subj.code} Practical`,
          message: `Marks must be between 0 and ${subj.practicalMax}`,
        });
      }

      const totalSubjMax = subj.theoryMax + subj.practicalMax;
      const totalSubjObtained = (isNaN(theoryObtained) ? 0 : theoryObtained) + (isNaN(practicalObtained) ? 0 : practicalObtained);

      // Check passing threshold (33%)
      if (totalSubjObtained < totalSubjMax * 0.33) {
        hasFailedSubject = true;
      }

      totalMax += totalSubjMax;
      totalObtained += totalSubjObtained;

      parsedSubjects.push({
        subjectCode: subj.code,
        theoryObtained: isNaN(theoryObtained) ? 0 : theoryObtained,
        practicalObtained: isNaN(practicalObtained) ? 0 : practicalObtained,
        theoryMax: subj.theoryMax,
        practicalMax: subj.practicalMax,
      });
    });

    const percentage = totalMax > 0 ? Number(((totalObtained / totalMax) * 100).toFixed(2)) : 0;
    const { grade } = calculateGrade(percentage);

    const status: "PASSED" | "FAILED" | "COMPARTMENT" =
      hasFailedSubject
        ? "FAILED"
        : percentage >= 33
        ? "PASSED"
        : "FAILED";

    records.push({
      rowNumber: rowNum,
      rollNumber,
      registrationNumber,
      fullName,
      fatherName,
      cnic,
      gender,
      dob,
      contactNo,
      subjects: parsedSubjects,
      totalMaxMarks: totalMax,
      totalObtainedMarks: totalObtained,
      percentage,
      grade,
      status,
      isValid: rowErrors.length === 0,
      errors: rowErrors,
    });
  });

  const validCount = records.filter((r) => r.isValid).length;
  const errorCount = records.length - validCount;

  return {
    success: errorCount === 0 && records.length > 0,
    totalRows: records.length,
    validCount,
    errorCount,
    records,
    errors,
  };
}
