import { NextRequest, NextResponse } from "next/server";

// POST /api/admin/auth — simple password verification
export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { error: "Admin password not configured." },
        { status: 500 }
      );
    }

    if (password === adminPassword) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
