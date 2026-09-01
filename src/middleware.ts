import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "bste_islamabad_secure_jwt_token_key_2026_super_secret";
const TOKEN_COOKIE_NAME = "bste_auth_token";

// Base64URL helper
function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return atob(base64);
}

// Edge-compatible Native Web Crypto HMAC-SHA256 Token Verifier
async function verifyJwtInEdge(token: string, secret: string): Promise<any | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;
    const encoder = new TextEncoder();
    const data = encoder.encode(`${headerB64}.${payloadB64}`);

    // Import secret key
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    // Convert signature from base64url to binary Uint8Array
    const binarySignature = Uint8Array.from(base64UrlDecode(signatureB64), (c) => c.charCodeAt(0));

    // Verify cryptographic signature
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      binarySignature,
      data
    );

    if (!isValid) return null;

    // Decode payload and verify expiration
    const payloadJson = base64UrlDecode(payloadB64);
    const payload = JSON.parse(payloadJson);

    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null; // Expired token
    }

    return payload;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(TOKEN_COOKIE_NAME)?.value;

  let isAuthenticated = false;

  if (token) {
    const payload = await verifyJwtInEdge(token, JWT_SECRET);
    if (payload && payload.userId) {
      isAuthenticated = true;
    }
  }

  // 1. Guard Admin Portal Pages
  if (pathname.startsWith("/portal/admin")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/portal/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname + req.nextUrl.search);
      const response = NextResponse.redirect(loginUrl);
      if (token) {
        // Clear invalid/expired cookie
        response.cookies.delete(TOKEN_COOKIE_NAME);
      }
      return response;
    }
  }

  // 2. Redirect already logged-in users away from /portal/login
  if (pathname === "/portal/login") {
    if (isAuthenticated) {
      const callbackUrl = req.nextUrl.searchParams.get("callbackUrl") || "/portal/admin/dashboard";
      return NextResponse.redirect(new URL(callbackUrl, req.url));
    }
  }

  // 3. Guard Protected Admin API Endpoints
  const isProtectedApi =
    pathname.startsWith("/api/results") ||
    pathname.startsWith("/api/reports") ||
    pathname.startsWith("/api/backup") ||
    pathname.startsWith("/api/logs");

  if (isProtectedApi) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized access: Valid administrative session token required." },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/portal/admin/:path*",
    "/portal/login",
    "/api/results/:path*",
    "/api/reports/:path*",
    "/api/backup/:path*",
    "/api/logs/:path*",
  ],
};
