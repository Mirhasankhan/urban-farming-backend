import { Prisma, Produce, ProductCategory } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";

const createNewProduce = async (vendorId: string, payload: Produce) => {
  const vendorProfile = await prisma.vendorProfile.findUnique({
    where: { userId: vendorId },
  });

  if (!vendorProfile) {
    throw new ApiError(404, "Vendor profile not found!");
  }

  if (vendorProfile.certificationStatus == "NotCertified") {
    throw new ApiError(403, "Vendor is not certified to add produce!");
  }

  const produce = await prisma.produce.findFirst({
    where: { name: payload.name, vendorId: vendorProfile.id },
  });

  if (produce) {
    throw new ApiError(
      400,
      "Produce with this name already exists for this vendor!",
    );
  }

  await prisma.produce.create({
    data: {
      vendorId: vendorProfile.id,
      name: payload.name,
      description: payload.description,
      price: payload.price,
      category: payload.category,
      availableQuantity: payload.availableQuantity,
    },
  });

  return;
};

const getAllCertifiedProducesFromDB = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  category?: ProductCategory,
) => {
  const whereCondition: Prisma.ProduceWhereInput = {
    certificationStatus: "Certified",
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...(category && {
      category: { equals: category },
    }),
  };

  const totalProduces = await prisma.produce.count({
    where: { certificationStatus: "Certified" },
  });

  const filteredProducesCount = await prisma.produce.count({
    where: whereCondition,
  });

  const totalPages = Math.ceil(filteredProducesCount / limit);

  const produces = await prisma.produce.findMany({
    where: whereCondition,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      description: true,
      availableQuantity: true,
      price: true,
      category: true,
      createdAt: true,
      vendor:{
        select: {
          id: true,
          farmLocation: true,
          farmName: true,
          user:{
            select: {
              id: true,
              fullName: true,
            }
          }
        }
      }
    },
  });

  return {
    meta: {
      totalProduces,
      filteredProduces: filteredProducesCount,
      totalPages,
      currentPage: page,
    },
    produces,
  };
};

export const produceService = {
  createNewProduce,
  getAllCertifiedProducesFromDB,
};
