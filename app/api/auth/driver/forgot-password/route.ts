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
    const raw = (await req.json())?.email;
    if (!raw) return NextResponse.json({ error: "Email required" }, { status: 400 });
    const email = String(raw).trim().toLowerCase();
    console.log("[driver/forgot-password] request for:", email);

    const driver = await prisma.driver.findUnique({ where: { email } });
    if (!driver) {
      console.log("[driver/forgot-password] driver not found:", email);
      return NextResponse.json({ ok: true });
    }
    console.log("[driver/forgot-password] driver found:", driver.name, driver.email);

    const tempPassword = generateTempPassword();
    const hashed = await bcrypt.hash(tempPassword, 12);
    await prisma.driver.update({ where: { email }, data: { password: hashed } });
    console.log("[driver/forgot-password] password updated in DB");

    const origin = req.headers.get("origin") ?? "https://ridebackbuddy.com";
    await sendTempPassword({
      toEmail: email,
      name: driver.name,
      tempPassword,
      loginUrl: `${origin}/driver/login`,
    });
    console.log("[driver/forgot-password] email sent successfully to:", email);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[driver/forgot-password] ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
