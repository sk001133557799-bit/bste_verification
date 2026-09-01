import { NextResponse } from "next/server";

export async function GET() {
  const programs = [
    {
      id: "prog-cit",
      code: "DAE-CIT",
      title: "Diploma of Associate Engineering (DAE) in Computer Information Technology",
      durationYears: 3,
      totalSemesters: 6,
    },
    {
      id: "prog-civil",
      code: "DAE-CIVIL",
      title: "Diploma of Associate Engineering (DAE) in Civil Technology",
      durationYears: 3,
      totalSemesters: 6,
    },
    {
      id: "prog-elect",
      code: "DAE-ELECT",
      title: "Diploma of Associate Engineering (DAE) in Electrical Technology",
      durationYears: 3,
      totalSemesters: 6,
    },
    {
      id: "prog-dit",
      code: "DIT",
      title: "Diploma in Information Technology (1 Year Professional Program)",
      durationYears: 1,
      totalSemesters: 2,
    },
    {
      id: "prog-ai",
      code: "BS-TECH-AI",
      title: "Bachelor of Science in Technology (Artificial Intelligence & Robotics)",
      durationYears: 4,
      totalSemesters: 8,
    },
  ];

  return NextResponse.json({ success: true, data: programs });
}
