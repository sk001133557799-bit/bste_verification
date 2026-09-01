const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Supabase PostgreSQL Result Verification Database...");

  // Clear existing data safely in reverse relational order
  await prisma.activityLog.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.result.deleteMany();
  await prisma.student.deleteMany();
  await prisma.user.deleteMany();

  // 1. Seed Admin User
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const adminUser = await prisma.user.create({
    data: {
      username: "admin",
      email: "admin@bste.edu.pk",
      passwordHash: adminPassword,
      fullName: "Board Administrator",
      role: "ADMIN",
    },
  });

  console.log(`✅ Admin user seeded: ${adminUser.username} (Password: Admin@123)`);

  // 2. Sample Student Results with Relational Subjects
  const sampleRecords = [
    {
      student: {
        studentName: "Muhammad Hamza Tariq",
        fatherName: "Tariq Mehmood Raja",
        rollNumber: "BSTE-2026-00125",
        registrationNumber: "BSTE-REG-2023-0941",
        program: "Diploma of Associate Engineering (DAE) in CIT",
        semester: "6th Semester / 3rd Year",
        session: "Annual Examination 2026",
        instituteName: "Islamabad College of Technology (ICT), Sector H-9",
        cnic: "61101-1234567-3",
        gender: "Male",
      },
      result: {
        verificationId: "BSTE-CERT-2026-89412",
        totalMarks: 700,
        obtainedMarks: 639,
        percentage: 91.29,
        gpa: 4.0,
        grade: "A+",
        status: "PASSED",
        issueDate: new Date("2026-08-15"),
        signatoryName: "Muhammad Sohail",
        signatoryTitle: "Prof. in Astrophysics and Controller of Examination",
      },
      subjects: [
        { subjectCode: "CIT-313", subjectName: "Web Development & Cloud Computing", theoryMax: 100, theoryObtained: 92, practicalMax: 50, practicalObtained: 48, totalMax: 150, totalObtained: 140, marks: 140, grade: "A+", status: "PASS" },
        { subjectCode: "CIT-324", subjectName: "Database Management Systems & SQL", theoryMax: 100, theoryObtained: 88, practicalMax: 50, practicalObtained: 47, totalMax: 150, totalObtained: 135, marks: 135, grade: "A+", status: "PASS" },
        { subjectCode: "CIT-333", subjectName: "Computer Networks & Network Security", theoryMax: 100, theoryObtained: 90, practicalMax: 50, practicalObtained: 46, totalMax: 150, totalObtained: 136, marks: 136, grade: "A+", status: "PASS" },
        { subjectCode: "MGT-311", subjectName: "Industrial Management & Human Relations", theoryMax: 100, theoryObtained: 84, practicalMax: 0, practicalObtained: 0, totalMax: 100, totalObtained: 84, marks: 84, grade: "A", status: "PASS" },
        { subjectCode: "CIT-399", subjectName: "Final Capstone Project & Viva Voce", theoryMax: 0, theoryObtained: 0, practicalMax: 150, practicalObtained: 144, totalMax: 150, totalObtained: 144, marks: 144, grade: "A+", status: "PASS" },
      ],
    },
    {
      student: {
        studentName: "Syeda Fatima Zahra",
        fatherName: "Syed Akhtar Hussain",
        rollNumber: "BSTE-2026-00126",
        registrationNumber: "BSTE-REG-2023-0942",
        program: "Diploma of Associate Engineering (DAE) in CIT",
        semester: "6th Semester / 3rd Year",
        session: "Annual Examination 2026",
        instituteName: "Govt Polytechnic Institute for Women, Sector H-8",
        cnic: "61101-9876543-2",
        gender: "Female",
      },
      result: {
        verificationId: "BSTE-CERT-2026-89413",
        totalMarks: 700,
        obtainedMarks: 663,
        percentage: 94.71,
        gpa: 4.0,
        grade: "A+",
        status: "PASSED",
        issueDate: new Date("2026-08-15"),
        signatoryName: "Muhammad Sohail",
        signatoryTitle: "Prof. in Astrophysics and Controller of Examination",
      },
      subjects: [
        { subjectCode: "CIT-313", subjectName: "Web Development & Cloud Computing", theoryMax: 100, theoryObtained: 95, practicalMax: 50, practicalObtained: 49, totalMax: 150, totalObtained: 144, marks: 144, grade: "A+", status: "PASS" },
        { subjectCode: "CIT-324", subjectName: "Database Management Systems & SQL", theoryMax: 100, theoryObtained: 94, practicalMax: 50, practicalObtained: 48, totalMax: 150, totalObtained: 142, marks: 142, grade: "A+", status: "PASS" },
        { subjectCode: "CIT-333", subjectName: "Computer Networks & Network Security", theoryMax: 100, theoryObtained: 92, practicalMax: 50, practicalObtained: 48, totalMax: 150, totalObtained: 140, marks: 140, grade: "A+", status: "PASS" },
        { subjectCode: "MGT-311", subjectName: "Industrial Management & Human Relations", theoryMax: 100, theoryObtained: 89, practicalMax: 0, practicalObtained: 0, totalMax: 100, totalObtained: 89, marks: 89, grade: "A+", status: "PASS" },
        { subjectCode: "CIT-399", subjectName: "Final Capstone Project & Viva Voce", theoryMax: 0, theoryObtained: 0, practicalMax: 150, practicalObtained: 148, totalMax: 150, totalObtained: 148, marks: 148, grade: "A+", status: "PASS" },
      ],
    },
    {
      student: {
        studentName: "Ahmed Ali Khan",
        fatherName: "Jahangir Khan",
        rollNumber: "BSTE-2026-00127",
        registrationNumber: "BSTE-REG-2023-0943",
        program: "Diploma of Associate Engineering (DAE) in CIT",
        semester: "6th Semester / 3rd Year",
        session: "Annual Examination 2026",
        instituteName: "Rawalpindi Institute of Technology",
        cnic: "37405-5544332-1",
        gender: "Male",
      },
      result: {
        verificationId: "BSTE-CERT-2026-89414",
        totalMarks: 700,
        obtainedMarks: 551,
        percentage: 78.71,
        gpa: 3.7,
        grade: "A",
        status: "PASSED",
        issueDate: new Date("2026-08-15"),
        signatoryName: "Muhammad Sohail",
        signatoryTitle: "Prof. in Astrophysics and Controller of Examination",
      },
      subjects: [
        { subjectCode: "CIT-313", subjectName: "Web Development & Cloud Computing", theoryMax: 100, theoryObtained: 78, practicalMax: 50, practicalObtained: 40, totalMax: 150, totalObtained: 118, marks: 118, grade: "A", status: "PASS" },
        { subjectCode: "CIT-324", subjectName: "Database Management Systems & SQL", theoryMax: 100, theoryObtained: 74, practicalMax: 50, practicalObtained: 42, totalMax: 150, totalObtained: 116, marks: 116, grade: "A", status: "PASS" },
        { subjectCode: "CIT-333", subjectName: "Computer Networks & Network Security", theoryMax: 100, theoryObtained: 80, practicalMax: 50, practicalObtained: 39, totalMax: 150, totalObtained: 119, marks: 119, grade: "A", status: "PASS" },
        { subjectCode: "MGT-311", subjectName: "Industrial Management & Human Relations", theoryMax: 100, theoryObtained: 70, practicalMax: 0, practicalObtained: 0, totalMax: 100, totalObtained: 70, marks: 70, grade: "A", status: "PASS" },
        { subjectCode: "CIT-399", subjectName: "Final Capstone Project & Viva Voce", theoryMax: 0, theoryObtained: 0, practicalMax: 150, practicalObtained: 128, totalMax: 150, totalObtained: 128, marks: 128, grade: "A", status: "PASS" },
      ],
    },
    {
      student: {
        studentName: "Zainab Bibi",
        fatherName: "Abdul Rasheed",
        rollNumber: "BSTE-2026-00128",
        registrationNumber: "BSTE-REG-2023-0944",
        program: "Diploma of Associate Engineering (DAE) in CIT",
        semester: "6th Semester / 3rd Year",
        session: "Annual Examination 2026",
        instituteName: "Govt Polytechnic Institute for Women, Sector H-8",
        cnic: "61101-3344556-4",
        gender: "Female",
      },
      result: {
        verificationId: "BSTE-CERT-2026-89415",
        totalMarks: 700,
        obtainedMarks: 589,
        percentage: 84.14,
        gpa: 4.0,
        grade: "A+",
        status: "PASSED",
        issueDate: new Date("2026-08-15"),
        signatoryName: "Muhammad Sohail",
        signatoryTitle: "Prof. in Astrophysics and Controller of Examination",
      },
      subjects: [
        { subjectCode: "CIT-313", subjectName: "Web Development & Cloud Computing", theoryMax: 100, theoryObtained: 82, practicalMax: 50, practicalObtained: 44, totalMax: 150, totalObtained: 126, marks: 126, grade: "A", status: "PASS" },
        { subjectCode: "CIT-324", subjectName: "Database Management Systems & SQL", theoryMax: 100, theoryObtained: 85, practicalMax: 50, practicalObtained: 45, totalMax: 150, totalObtained: 130, marks: 130, grade: "A+", status: "PASS" },
        { subjectCode: "CIT-333", subjectName: "Computer Networks & Network Security", theoryMax: 100, theoryObtained: 78, practicalMax: 50, practicalObtained: 41, totalMax: 150, totalObtained: 119, marks: 119, grade: "A", status: "PASS" },
        { subjectCode: "MGT-311", subjectName: "Industrial Management & Human Relations", theoryMax: 100, theoryObtained: 79, practicalMax: 0, practicalObtained: 0, totalMax: 100, totalObtained: 79, marks: 79, grade: "A", status: "PASS" },
        { subjectCode: "CIT-399", subjectName: "Final Capstone Project & Viva Voce", theoryMax: 0, theoryObtained: 0, practicalMax: 150, practicalObtained: 135, totalMax: 150, totalObtained: 135, marks: 135, grade: "A", status: "PASS" },
      ],
    },
    {
      student: {
        studentName: "Bilal Hassan",
        fatherName: "Hassan Raza",
        rollNumber: "BSTE-2025-00084",
        registrationNumber: "BSTE-REG-2022-0418",
        program: "Diploma of Associate Engineering (DAE) in Civil Technology",
        semester: "6th Semester / 3rd Year",
        session: "Annual Examination 2025",
        instituteName: "Islamabad College of Technology (ICT)",
        cnic: "61101-8899001-5",
        gender: "Male",
      },
      result: {
        verificationId: "BSTE-CERT-2025-77194",
        totalMarks: 550,
        obtainedMarks: 436,
        percentage: 79.27,
        gpa: 3.7,
        grade: "A",
        status: "PASSED",
        issueDate: new Date("2025-08-20"),
        signatoryName: "Muhammad Sohail",
        signatoryTitle: "Prof. in Astrophysics and Controller of Examination",
      },
      subjects: [
        { subjectCode: "CIV-314", subjectName: "Concrete Technology & RCC Design", theoryMax: 100, theoryObtained: 80, practicalMax: 50, practicalObtained: 42, totalMax: 150, totalObtained: 122, marks: 122, grade: "A", status: "PASS" },
        { subjectCode: "CIV-323", subjectName: "Quantity Surveying & Estimation", theoryMax: 100, theoryObtained: 75, practicalMax: 50, practicalObtained: 40, totalMax: 150, totalObtained: 115, marks: 115, grade: "A", status: "PASS" },
        { subjectCode: "CIV-334", subjectName: "Soil Mechanics & Foundation Engineering", theoryMax: 100, theoryObtained: 78, practicalMax: 50, practicalObtained: 39, totalMax: 150, totalObtained: 117, marks: 117, grade: "A", status: "PASS" },
        { subjectCode: "GEN-311", subjectName: "Technical Report Writing & Ethics", theoryMax: 100, theoryObtained: 82, practicalMax: 0, practicalObtained: 0, totalMax: 100, totalObtained: 82, marks: 82, grade: "A", status: "PASS" },
      ],
    },
  ];

  for (const item of sampleRecords) {
    const student = await prisma.student.create({
      data: item.student,
    });

    const result = await prisma.result.create({
      data: {
        studentId: student.id,
        ...item.result,
      },
    });

    for (const subj of item.subjects) {
      await prisma.subject.create({
        data: {
          resultId: result.id,
          ...subj,
        },
      });
    }
  }

  console.log(`✅ Seeded ${sampleRecords.length} relational student records with subjects.`);
  console.log("🚀 Supabase PostgreSQL seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
