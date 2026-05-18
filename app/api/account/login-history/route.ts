import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCustomerSession } from "@/lib/auth";

export async function GET() {
  const session = await getCustomerSession();
  if (!session || session.role !== "customer") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const logs = await prisma.loginLog.findMany({
    where: { entityId: session.id, role: "customer" },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json(logs);
}
