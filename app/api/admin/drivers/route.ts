import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const drivers = await prisma.driver.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      email: true,
      name: true,
      phone: true,
      licenseNo: true,
      vehicleInfo: true,
      status: true,
      _count: { select: { bookings: true } },
    },
  });

  return NextResponse.json(drivers);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, email, password, phone, licenseNo, vehicleInfo } = await req.json();

    if (!name || !email || !password || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await prisma.driver.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const driver = await prisma.driver.create({
      data: { name, email, password: hashed, phone, licenseNo, vehicleInfo },
      select: { id: true, name: true, email: true, phone: true, licenseNo: true, vehicleInfo: true, status: true, createdAt: true },
    });

    return NextResponse.json(driver, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/drivers", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
