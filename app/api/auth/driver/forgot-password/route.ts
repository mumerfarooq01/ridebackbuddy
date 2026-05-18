import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendTempPassword } from "@/lib/email";

function generateTempPassword(len = 10): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const driver = await prisma.driver.findUnique({ where: { email } });
    if (!driver) return NextResponse.json({ ok: true });

    const tempPassword = generateTempPassword();
    const hashed = await bcrypt.hash(tempPassword, 12);
    await prisma.driver.update({ where: { email }, data: { password: hashed } });

    const origin = req.headers.get("origin") ?? "https://ridebackbuddy.com";
    await sendTempPassword({
      toEmail: email,
      name: driver.name,
      tempPassword,
      loginUrl: `${origin}/driver/login`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/auth/driver/forgot-password", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
