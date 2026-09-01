import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "public/bste-islamabad.apk");

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "APK build file not found" }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.android.package-archive",
      "Content-Disposition": 'attachment; filename="bste-islamabad.apk"',
      "Content-Length": fileBuffer.length.toString(),
    },
  });
}
