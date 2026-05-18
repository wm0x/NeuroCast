import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("1234", 10);

  // 1. Admin
  await prisma.user.create({
    data: {
      username: "admin",
      password: hashedPassword,
      name: "Admin Name",
      role: "ADMIN",
    },
  });

  // 2. Doctor
  await prisma.user.create({
    data: {
      username: "doctor",
      password: hashedPassword,
      name: "Doctor Name",
      role: "DOCTOR",
    },
  });

  // 3. Guest
  await prisma.user.create({
    data: {
      username: "guest",
      password: hashedPassword,
      name: "Guest Name",
      role: "GUEST",
    },
  });

  console.log("Users created successfully!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());