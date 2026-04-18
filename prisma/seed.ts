import { PrismaClient } from "@prisma/client";
import config from "../src/config";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const VENDOR_COUNT = 10;
const PRODUCTS_PER_VENDOR = 10;

const productCategories = [
  "VEGETABLE",
  "FRUIT",
  "GRAIN",
  "DAIRY",
  "SEED",
  "TOOL",
  "FERTILIZER",
  "HERB",
] as const;

const vendorLocations = [
  "Lagos",
  "Abuja",
  "Kano",
  "Port Harcourt",
  "Ibadan",
  "Kaduna",
  "Benin City",
  "Enugu",
  "Owerri",
  "Calabar",
];

async function main() {
  const saltRounds = Number(
    config.jwt.gen_salt || config.bcrypt_salt_rounds || 10,
  );

  const hashedPassword = await bcrypt.hash("123456", saltRounds);

  // Base users
  const admin = await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {
      fullName: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
      status: "Active",
    },
    create: {
      email: "admin@gmail.com",
      fullName: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
      status: "Active",
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@gmail.com" },
    update: {
      fullName: "Seed Customer",
      password: hashedPassword,
      role: "CUSTOMER",
      status: "Active",
    },
    create: {
      email: "customer@gmail.com",
      fullName: "Seed Customer",
      password: hashedPassword,
      role: "CUSTOMER",
      status: "Active",
    },
  });

  // Vendors + vendor profiles
  const vendorProfiles: { id: string; farmName: string }[] = [];

  for (let index = 1; index <= VENDOR_COUNT; index += 1) {
    const vendorUser = await prisma.user.upsert({
      where: { email: `vendor${index}@gmail.com` },
      update: {
        fullName: `Seed Vendor ${index}`,
        password: hashedPassword,
        role: "VENDOR",
        status: "Active",
      },
      create: {
        email: `vendor${index}@gmail.com`,
        fullName: `Seed Vendor ${index}`,
        password: hashedPassword,
        role: "VENDOR",
        status: "Active",
      },
    });

    const vendorProfile = await prisma.vendorProfile.upsert({
      where: { userId: vendorUser.id },
      update: {
        farmName: `Green Farm ${index}`,
        farmLocation: vendorLocations[index - 1],
      },
      create: {
        userId: vendorUser.id,
        farmName: `Green Farm ${index}`,
        farmLocation: vendorLocations[index - 1],
      },
    });

    vendorProfiles.push({
      id: vendorProfile.id,
      farmName: vendorProfile.farmName,
    });
  }

  // 100 products total (10 per vendor)
  for (
    let vendorIndex = 0;
    vendorIndex < vendorProfiles.length;
    vendorIndex += 1
  ) {
    const profile = vendorProfiles[vendorIndex];

    for (
      let productIndex = 1;
      productIndex <= PRODUCTS_PER_VENDOR;
      productIndex += 1
    ) {
      const globalProductIndex =
        vendorIndex * PRODUCTS_PER_VENDOR + productIndex;
      const productName = `${profile.farmName} Produce ${productIndex}`;

      await prisma.produce.upsert({
        where: {
          vendorId_name: {
            vendorId: profile.id,
            name: productName,
          },
        },
        update: {
          description: `Seeded produce item #${globalProductIndex}`,
          price: 500 + globalProductIndex * 15,
          category:
            productCategories[globalProductIndex % productCategories.length],
          availableQuantity: 25 + productIndex,
        },
        create: {
          vendorId: profile.id,
          name: productName,
          description: `Seeded produce item #${globalProductIndex}`,
          price: 500 + globalProductIndex * 15,
          category:
            productCategories[globalProductIndex % productCategories.length],
          availableQuantity: 25 + productIndex,
        },
      });
    }
  }

  const [userCount, vendorCount, produceCount] = await Promise.all([
    prisma.user.count(),
    prisma.vendorProfile.count(),
    prisma.produce.count(),
  ]);

  console.log("✅ Database seeded successfully");
  console.log(`Admin: ${admin.email}`);
  console.log(`Customer: ${customer.email}`);
  console.log(`Total users: ${userCount}`);
  console.log(`Total vendors: ${vendorCount}`);
  console.log(`Total produces: ${produceCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
