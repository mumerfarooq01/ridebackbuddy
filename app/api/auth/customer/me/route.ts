import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/auth";

export async function GET() {
  const session = await getCustomerSession();
  if (!session || session.role !== "customer") {
    return NextResponse.json(null, { status: 401 });
  }
  return NextResponse.json({ name: session.name, email: session.email });
}
