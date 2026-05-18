import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDriverSession } from "@/lib/auth";

export async function GET() {
  const session = await getDriverSession();
  if (!session || session.role !== "driver") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const driver = await prisma.driver.findUnique({
    where: { id: session.id },
    select: { id: true, name: true, email: true, phone: true, licenseNo: true, vehicleInfo: true, status: true },
  });

  if (!driver) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(driver);
}
