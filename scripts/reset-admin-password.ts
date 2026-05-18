import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

const NEW_PASSWORD = "Admin@1234";

async function main() {
  const users = await prisma.user.findMany({ select: { id: true, email: true, name: true } });
  console.log("Admin users found:", users);

  const hashed = await bcrypt.hash(NEW_PASSWORD, 12);

  if (users.length === 0) {
    const user = await prisma.user.create({
      data: { email: "admin@ridebackbuddy.com", name: "Admin", password: hashed, role: "admin" },
    });
    console.log("Created admin:", user.email);
  } else {
    for (const u of users) {
      await prisma.user.update({ where: { id: u.id }, data: { password: hashed } });
      console.log(`Reset password for: ${u.email}`);
    }
  }

  console.log(`\nPassword set to: ${NEW_PASSWORD}`);
}

main().catch(console.error);
