import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sendDriverAssignedToUser, sendBookingAssignedToDriver } from "@/lib/email";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      driver: {
        select: { id: true, name: true, email: true, phone: true, status: true, vehicleInfo: true, licenseNo: true },
      },
    },
  });

  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(booking);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const data: Record<string, string | null> = {};
  if (body.status !== undefined) data.status = body.status;
  if (body.driverId !== undefined) data.driverId = body.driverId;

  const booking = await prisma.booking.update({
    where: { id },
    data,
    include: {
      driver: { select: { id: true, name: true, email: true, phone: true, vehicleInfo: true, licenseNo: true } },
    },
  });

  // Send emails when a driver is newly assigned
  if (body.driverId && booking.driver) {
    const driver = booking.driver;

    sendDriverAssignedToUser({
      toEmail: booking.email,
      customerName: booking.fullName,
      pickupDate: booking.pickupDate,
      pickupTime: booking.pickupTime,
      pickupAddress: booking.pickupAddress,
      dropoffAddress: booking.dropoffAddress,
      driverName: driver.name,
      driverPhone: driver.phone,
      vehicleInfo: driver.vehicleInfo,
      licenseNo: driver.licenseNo,
    }).catch((e) => console.error("Driver-assigned-to-user email failed", e));

    sendBookingAssignedToDriver({
      toEmail: driver.email,
      driverName: driver.name,
      customerName: booking.fullName,
      customerPhone: booking.phone,
      serviceType: booking.serviceType,
      pickupDate: booking.pickupDate,
      pickupTime: booking.pickupTime,
      pickupAddress: booking.pickupAddress,
      dropoffAddress: booking.dropoffAddress,
      passengers: booking.passengers,
      fareTotal: booking.fareTotal,
      paymentMethod: booking.paymentMethod,
      accessibility: booking.accessibility,
      specialNotes: booking.specialNotes,
    }).catch((e) => console.error("Booking-assigned-to-driver email failed", e));
  }

  return NextResponse.json(booking);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.booking.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
