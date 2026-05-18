import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendBookingConfirmation, sendNewBookingToAdmins, sendWelcomeWithPassword } from "@/lib/email";

function generateTempPassword(len = 10): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

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

    const origin = req.headers.get("origin") ?? "https://ridebackbuddy.com";

    // Fire confirmation email to customer
    sendBookingConfirmation({
      toEmail: booking.email,
      bookingId: booking.id,
      fullName: booking.fullName,
      phone: booking.phone,
      serviceType: booking.serviceType,
      pickupDate: booking.pickupDate,
      pickupTime: booking.pickupTime,
      pickupAddress: booking.pickupAddress,
      dropoffAddress: booking.dropoffAddress,
      passengers: booking.passengers,
      accessibility: booking.accessibility,
      estimatedDistance: booking.estimatedDistance,
      region: booking.region,
      paymentMethod: booking.paymentMethod,
      stops: booking.stops,
      use407: booking.use407,
      km407: booking.km407,
      fareTotal: booking.fareTotal,
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

    // Auto-create customer account if this email is new
    prisma.customer.findUnique({ where: { email: booking.email } })
      .then(async (existing) => {
        if (!existing) {
          const tempPassword = generateTempPassword();
          const hashed = await bcrypt.hash(tempPassword, 12);
          await prisma.customer.create({
            data: {
              email: booking.email,
              name: booking.fullName,
              phone: booking.phone || null,
              password: hashed,
            },
          });
          await sendWelcomeWithPassword({
            toEmail: booking.email,
            name: booking.fullName,
            tempPassword,
            loginUrl: `${origin}/login`,
          });
          console.log("[bookings] Auto-created customer account for:", booking.email);
        }
      })
      .catch((e) => console.error("[bookings] Auto-create customer failed", e));

    return NextResponse.json({ id: booking.id }, { status: 201 });
  } catch (err) {
    console.error("POST /api/bookings", err);
    return NextResponse.json({ error: "Failed to save booking" }, { status: 500 });
  }
}
