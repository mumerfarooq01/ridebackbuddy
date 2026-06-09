import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken, DRIVER_COOKIE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = body?.password;

    const driver = await prisma.driver.findUnique({ where: { email } });
    if (!driver) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, driver.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Record login
    await prisma.loginLog.create({
      data: {
        role: "driver",
        entityId: driver.id,
        entityName: driver.name,
        email: driver.email,
        ip: req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? null,
        userAgent: req.headers.get("user-agent") ?? null,
      },
    });

    const token = await signToken({ id: driver.id, email: driver.email, name: driver.name, role: "driver" });
    const res = NextResponse.json({ ok: true });
    res.cookies.set(DRIVER_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return res;
  } catch (err) {
    console.error("POST /api/auth/driver/login", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
