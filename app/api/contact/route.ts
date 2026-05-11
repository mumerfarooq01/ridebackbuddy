import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const contact = await prisma.contact.create({
      data: {
        name: body.name,
        phone: body.phone,
        email: body.email,
        message: body.message,
      },
    });
    return NextResponse.json({ id: contact.id }, { status: 201 });
  } catch (err) {
    console.error("POST /api/contact", err);
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
  }
}
