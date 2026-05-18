import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDriverSession } from "@/lib/auth";

export async function GET() {
  const session = await getDriverSession();
  if (!session || session.role !== "driver") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookings = await prisma.booking.findMany({
    where: { driverId: session.id },
    orderBy: { pickupDate: "asc" },
  });

  return NextResponse.json(bookings);
}
