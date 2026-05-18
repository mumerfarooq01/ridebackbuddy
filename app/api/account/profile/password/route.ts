import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCustomerSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function PATCH(req: NextRequest) {
  const session = await getCustomerSession();
  if (!session || session.role !== "customer") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) return NextResponse.json({ error: "Both fields required" }, { status: 400 });
  if (newPassword.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });

  const customer = await prisma.customer.findUnique({ where: { id: session.id } });
  if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const valid = await bcrypt.compare(currentPassword, customer.password);
  if (!valid) return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });

  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.customer.update({ where: { id: session.id }, data: { password: hashed } });
  return NextResponse.json({ ok: true });
}
