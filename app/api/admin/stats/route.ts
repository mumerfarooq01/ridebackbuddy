import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [totalBookings, pendingBookings, confirmedBookings, totalContacts, unreadContacts, recentBookings] =
    await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "pending" } }),
      prisma.booking.count({ where: { status: "confirmed" } }),
      prisma.contact.count(),
      prisma.contact.count({ where: { status: "unread" } }),
      prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, fullName: true, serviceType: true, pickupDate: true, fareTotal: true, status: true, createdAt: true },
      }),
    ]);

  return NextResponse.json({
    totalBookings,
    pendingBookings,
    confirmedBookings,
    totalContacts,
    unreadContacts,
    recentBookings,
  });
}
