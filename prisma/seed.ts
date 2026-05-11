import { config } from "dotenv";
config({ path: ".env.local" });

import ws from "ws";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../app/generated/prisma/client";
import bcrypt from "bcryptjs";

neonConfig.webSocketConstructor = ws;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! } as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@ridebackbuddy.com";
  const password = process.env.ADMIN_PASSWORD ?? "change-me";
  const name = "Admin";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user already exists: ${email}`);
    return;
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, password: hashed, name, role: "admin" },
  });
  console.log(`✅  Created admin user: ${user.email}`);

  // Seed default pricing settings
  const defaults = [
    { key: "BASE_FARE", value: "31.00", label: "Base Fare (first 10 km)" },
    { key: "BASE_KM", value: "10", label: "Included km in base fare" },
    { key: "PER_KM_RATE", value: "2.75", label: "Rate per km over base" },
    { key: "CC_SURCHARGE", value: "1.00", label: "Credit card surcharge" },
    { key: "STOP_FEE", value: "3.00", label: "Intermediate stop fee" },
    { key: "TOLL_407_BASE", value: "15.00", label: "407 ETR base fee" },
    { key: "TOLL_407_PER_KM", value: "0.25", label: "407 ETR per km rate" },
  ];

  for (const item of defaults) {
    await prisma.pricingSetting.upsert({
      where: { key: item.key },
      update: {},
      create: item,
    });
  }
  console.log(`✅  Seeded ${defaults.length} pricing settings`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
