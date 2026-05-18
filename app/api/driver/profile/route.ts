import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDriverSession, signToken, DRIVER_COOKIE } from "@/lib/auth";

export async function GET() {
  const session = await getDriverSession();
  if (!session || session.role !== "driver") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const driver = await prisma.driver.findUnique({
    where: { id: session.id },
    select: { id: true, name: true, email: true, phone: true, licenseNo: true, vehicleInfo: true, status: true, createdAt: true },
  });
  if (!driver) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(driver);
}

export async function PATCH(req: NextRequest) {
  const session = await getDriverSession();
  if (!session || session.role !== "driver") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, email, phone, licenseNo, vehicleInfo } = await req.json();
  if (!name || !email || !phone) return NextResponse.json({ error: "Name, email and phone required" }, { status: 400 });

  const existing = await prisma.driver.findFirst({ where: { email, NOT: { id: session.id } } });
  if (existing) return NextResponse.json({ error: "Email already in use" }, { status: 409 });

  const driver = await prisma.driver.update({
    where: { id: session.id },
    data: { name, email, phone, licenseNo: licenseNo || null, vehicleInfo: vehicleInfo || null },
    select: { id: true, name: true, email: true, phone: true, licenseNo: true, vehicleInfo: true, status: true },
  });

  // Reissue JWT with updated name/email
  const token = await signToken({ id: driver.id, email: driver.email, name: driver.name, role: "driver" });
  const res = NextResponse.json(driver);
  res.cookies.set(DRIVER_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}
