import { NextResponse } from "next/server";

export async function GET() {
  const sessions = [
    { id: "sess-2023", sessionName: "2023-2026", startYear: 2023, endYear: 2026, isActive: true },
    { id: "sess-2024", sessionName: "2024-2027", startYear: 2024, endYear: 2027, isActive: true },
    { id: "sess-2022", sessionName: "2022-2025", startYear: 2022, endYear: 2025, isActive: false },
  ];

  return NextResponse.json({ success: true, data: sessions });
}
