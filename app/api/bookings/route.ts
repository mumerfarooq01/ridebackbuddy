import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendBookingConfirmation, sendNewBookingToAdmins } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const booking = await prisma.booking.create({
      data: {
        serviceType: body.serviceType,
        pickupDate: body.pickupDate,
        pickupTime: body.pickupTime,
        pickupAddress: body.pickupAddress,
        pickupLat: body.pickupLat ?? null,
        pickupLng: body.pickupLng ?? null,
        dropoffAddress: body.dropoffAddress,
        dropoffLat: body.dropoffLat ?? null,
        dropoffLng: body.dropoffLng ?? null,
        estimatedDistance: body.estimatedDistance ? parseFloat(body.estimatedDistance) : null,
        region: body.region,
        paymentMethod: body.paymentMethod,
        stops: Number(body.stops) || 0,
        use407: Boolean(body.use407),
        km407: Number(body.km407) || 0,
        specialNotes: body.specialNotes || null,
        fullName: body.fullName,
        phone: body.phone,
        email: body.email,
        passengers: Number(body.passengers) || 1,
        accessibility: Boolean(body.accessibility),
        fareTotal: Number(body.fareTotal) || 0,
      },
    });
    // Fire confirmation email to customer
    sendBookingConfirmation({
      toEmail: booking.email,
      fullName: booking.fullName,
      serviceType: booking.serviceType,
      pickupDate: booking.pickupDate,
      pickupTime: booking.pickupTime,
      pickupAddress: booking.pickupAddress,
      dropoffAddress: booking.dropoffAddress,
      passengers: booking.passengers,
      fareTotal: booking.fareTotal,
      paymentMethod: booking.paymentMethod,
      specialNotes: booking.specialNotes,
    }).catch((e) => console.error("Booking confirmation email failed", e));

    // Notify all admins
    prisma.user.findMany({ select: { email: true } }).then((admins) => {
      const adminEmails = admins.map((a) => a.email);
      return sendNewBookingToAdmins({
        toEmails: adminEmails,
        fullName: booking.fullName,
        phone: booking.phone,
        email: booking.email,
        serviceType: booking.serviceType,
        pickupDate: booking.pickupDate,
        pickupTime: booking.pickupTime,
        pickupAddress: booking.pickupAddress,
        dropoffAddress: booking.dropoffAddress,
        passengers: booking.passengers,
        fareTotal: booking.fareTotal,
        paymentMethod: booking.paymentMethod,
        specialNotes: booking.specialNotes,
      });
    }).catch((e) => console.error("Admin booking notification failed", e));

    return NextResponse.json({ id: booking.id }, { status: 201 });
  } catch (err) {
    console.error("POST /api/bookings", err);
    return NextResponse.json({ error: "Failed to save booking" }, { status: 500 });
  }
}
