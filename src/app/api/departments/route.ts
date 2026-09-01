import { NextResponse } from "next/server";

export async function GET() {
  const departments = [
    { id: "dept-cit", code: "DEPT-CIT", name: "Department of Computer & Information Technology" },
    { id: "dept-civil", code: "DEPT-CIVIL", name: "Department of Civil Engineering Technology" },
    { id: "dept-elect", code: "DEPT-ELECT", name: "Department of Electrical & Electronics Technology" },
    { id: "dept-ai", code: "DEPT-AI", name: "Department of Artificial Intelligence & Emerging Tech" },
  ];

  return NextResponse.json({ success: true, data: departments });
}
