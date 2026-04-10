import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionValue,
  isAdminConfigured,
  isValidAdminPassword,
} from "@/lib/adminAuth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = String(body?.password || "");

    if (!isAdminConfigured()) {
      return NextResponse.json(
        { error: "Admin access is not configured. Set ADMIN_PASSWORD and ADMIN_SECRET." },
        { status: 500 }
      );
    }

    if (!isValidAdminPassword(password)) {
      return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSessionValue(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Failed to login." }, { status: 500 });
  }
}
