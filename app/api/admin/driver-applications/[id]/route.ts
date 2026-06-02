import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { sendDriverApproved } from "@/lib/email";

function generateTempPassword(len = 10): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { action } = await req.json();

  const application = await prisma.driverApplication.findUnique({ where: { id } });
  if (!application) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (action === "approve") {
    const existing = await prisma.driver.findUnique({ where: { email: application.email } });
    if (existing) {
      await prisma.driverApplication.update({ where: { id }, data: { status: "approved" } });
      return NextResponse.json({ ok: true, note: "Driver account already exists" });
    }

    const tempPassword = generateTempPassword();
    const hashed = await bcrypt.hash(tempPassword, 12);
    const driver = await prisma.driver.create({
      data: {
        name: `${application.firstName} ${application.lastName}`,
        email: application.email,
        phone: application.phone,
        password: hashed,
      },
    });

    await prisma.driverApplication.update({ where: { id }, data: { status: "approved" } });

    const origin = req.headers.get("origin") ?? "https://ridebackbuddy.com";
    sendDriverApproved({
      toEmail: application.email,
      name: `${application.firstName} ${application.lastName}`,
      tempPassword,
      loginUrl: `${origin}/driver/login`,
    }).catch((e) => console.error("Driver approved email failed", e));

    return NextResponse.json({ ok: true, driverId: driver.id });
  }

  if (action === "reject") {
    await prisma.driverApplication.update({ where: { id }, data: { status: "rejected" } });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
