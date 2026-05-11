import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const settings = await prisma.pricingSetting.findMany({ orderBy: { key: "asc" } });
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const updates: { key: string; value: string }[] = await req.json();

  const results = await Promise.all(
    updates.map(({ key, value }) =>
      prisma.pricingSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value, label: key },
      })
    )
  );

  return NextResponse.json(results);
}
