import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCustomerSession } from "@/lib/auth";

export async function GET() {
  const session = await getCustomerSession();
  if (!session || session.role !== "customer") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Match bookings by the customer's email
  const bookings = await prisma.booking.findMany({
    where: { email: session.email },
    orderBy: { createdAt: "desc" },
    include: {
      driver: { select: { name: true, phone: true, vehicleInfo: true } },
    },
  });

  return NextResponse.json(bookings);
}
