import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken, CUSTOMER_COOKIE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const existing = await prisma.customer.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const customer = await prisma.customer.create({
      data: { name, email, password: hashed, phone: phone || null },
    });

    const token = await signToken({ id: customer.id, email: customer.email, name: customer.name, role: "customer" });
    const res = NextResponse.json({ ok: true }, { status: 201 });
    res.cookies.set(CUSTOMER_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return res;
  } catch (err) {
    console.error("POST /api/auth/customer/register", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
