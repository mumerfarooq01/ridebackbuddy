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

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ ok: true });

    const tempPassword = generateTempPassword();
    const hashed = await bcrypt.hash(tempPassword, 12);
    await prisma.user.update({ where: { email }, data: { password: hashed } });

    const origin = req.headers.get("origin") ?? "https://ridebackbuddy.com";
    await sendTempPassword({
      toEmail: email,
      name: user.name,
      tempPassword,
      loginUrl: `${origin}/admin/login`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[forgot-password] ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
