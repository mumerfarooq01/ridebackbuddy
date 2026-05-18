import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken, CUSTOMER_COOKIE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const customer = await prisma.customer.findUnique({ where: { email } });
    if (!customer) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, customer.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    await prisma.loginLog.create({
      data: {
        role: "customer",
        entityId: customer.id,
        entityName: customer.name,
        email: customer.email,
        ip: req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? null,
        userAgent: req.headers.get("user-agent") ?? null,
      },
    });

    const token = await signToken({ id: customer.id, email: customer.email, name: customer.name, role: "customer" });
    const res = NextResponse.json({ ok: true });
    res.cookies.set(CUSTOMER_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return res;
  } catch (err) {
    console.error("POST /api/auth/customer/login", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
