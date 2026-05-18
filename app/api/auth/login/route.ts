import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken, COOKIE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Record login
    await prisma.loginLog.create({
      data: {
        role: "admin",
        entityId: user.id,
        entityName: user.name,
        email: user.email,
        ip: req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? null,
        userAgent: req.headers.get("user-agent") ?? null,
      },
    });

    const token = await signToken({ id: user.id, email: user.email, name: user.name, role: user.role });
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return res;
  } catch (err) {
    console.error("POST /api/auth/login", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
