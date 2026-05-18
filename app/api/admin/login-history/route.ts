import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const role = searchParams.get("role");       // "admin" | "driver" | "customer" | null (all)
  const entityId = searchParams.get("entityId"); // filter by specific user

  const logs = await prisma.loginLog.findMany({
    where: {
      ...(role ? { role } : {}),
      ...(entityId ? { entityId } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json(logs);
}
