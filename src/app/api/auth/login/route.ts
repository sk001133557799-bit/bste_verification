import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, signJwtToken } from "@/lib/auth";
import { logActivity } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Username/Email and Password are required." },
        { status: 400 }
      );
    }

    const cleanIdentifier = identifier.trim().toLowerCase();

    // Find admin user
    const user = await db.user.findFirst({
      where: {
        OR: [
          { username: cleanIdentifier },
          { email: cleanIdentifier },
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    const tokenPayload = {
      userId: user.id,
      username: user.username,
      email: user.email || undefined,
      fullName: user.fullName,
      role: user.role,
    };

    const token = signJwtToken(tokenPayload);

    await logActivity({
      userId: user.id,
      action: "ADMIN_LOGIN",
      details: { username: user.username },
    });

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful.",
      data: {
        user: tokenPayload,
      },
    });

    response.cookies.set("bste_auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: any) {
    console.error("Login API Error:", err);
    return NextResponse.json(
      { error: "Authentication error: " + (err?.message || "Internal server error") },
      { status: 500 }
    );
  }
}
