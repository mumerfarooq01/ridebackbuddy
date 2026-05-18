import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const allowed = ["name", "phone", "licenseNo", "vehicleInfo", "status"];
  const data: Record<string, string> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) data[key] = body[key];
  }

  const driver = await prisma.driver.update({ where: { id }, data });
  return NextResponse.json(driver);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  // Unassign bookings before deleting
  await prisma.booking.updateMany({ where: { driverId: id }, data: { driverId: null } });
  await prisma.driver.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
