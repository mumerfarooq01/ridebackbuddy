import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDriverSession } from "@/lib/auth";

const VALID_STATUSES = ["available", "busy", "offline"];

export async function PATCH(req: NextRequest) {
  const session = await getDriverSession();
  if (!session || session.role !== "driver") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { status } = await req.json();
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const driver = await prisma.driver.update({
    where: { id: session.id },
    data: { status },
    select: { id: true, status: true },
  });

  return NextResponse.json(driver);
}
