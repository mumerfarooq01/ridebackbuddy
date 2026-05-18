import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, signToken, COOKIE } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, email } = await req.json();
  if (!name || !email) return NextResponse.json({ error: "Name and email required" }, { status: 400 });

  // Check email not taken by someone else
  const existing = await prisma.user.findFirst({ where: { email, NOT: { id: session.id } } });
  if (existing) return NextResponse.json({ error: "Email already in use" }, { status: 409 });

  const user = await prisma.user.update({
    where: { id: session.id },
    data: { name, email },
    select: { id: true, name: true, email: true, role: true },
  });

  // Reissue JWT with updated name/email
  const token = await signToken({ id: user.id, email: user.email, name: user.name, role: user.role });
  const res = NextResponse.json(user);
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}
