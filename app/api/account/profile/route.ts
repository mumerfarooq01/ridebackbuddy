import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCustomerSession, signToken, CUSTOMER_COOKIE } from "@/lib/auth";

export async function GET() {
  const session = await getCustomerSession();
  if (!session || session.role !== "customer") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const customer = await prisma.customer.findUnique({
    where: { id: session.id },
    select: { id: true, name: true, email: true, phone: true, createdAt: true },
  });
  if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(customer);
}

export async function PATCH(req: NextRequest) {
  const session = await getCustomerSession();
  if (!session || session.role !== "customer") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, email, phone } = await req.json();
  if (!name || !email) return NextResponse.json({ error: "Name and email required" }, { status: 400 });

  const existing = await prisma.customer.findFirst({ where: { email, NOT: { id: session.id } } });
  if (existing) return NextResponse.json({ error: "Email already in use" }, { status: 409 });

  const customer = await prisma.customer.update({
    where: { id: session.id },
    data: { name, email, phone: phone || null },
    select: { id: true, name: true, email: true, phone: true },
  });

  const token = await signToken({ id: customer.id, email: customer.email, name: customer.name, role: "customer" });
  const res = NextResponse.json(customer);
  res.cookies.set(CUSTOMER_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}
