import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

const bcrypt = require("bcryptjs");
const { PrismaClient } = require(join(__dirname, "../app/generated/prisma/index.js"));

const prisma = new PrismaClient();
const NEW_PASSWORD = "Admin@1234";

async function main() {
  const users = await prisma.user.findMany({ select: { id: true, email: true, name: true } });
  console.log("Admin users found:", users);

  if (users.length === 0) {
    console.log("No admin users in DB. Creating one...");
    const hashed = await bcrypt.hash(NEW_PASSWORD, 12);
    const user = await prisma.user.create({
      data: { email: "admin@ridebackbuddy.com", name: "Admin", password: hashed, role: "admin" },
    });
    console.log("Created admin:", user.email);
  } else {
    const hashed = await bcrypt.hash(NEW_PASSWORD, 12);
    for (const u of users) {
      await prisma.user.update({ where: { id: u.id }, data: { password: hashed } });
      console.log(`Reset password for: ${u.email}`);
    }
  }

  console.log(`\nDone! Password is now: ${NEW_PASSWORD}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
