import { Prisma, ProductCategory } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";

const getAllCustomersFromDB = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
) => {
  const whereCondition: Prisma.UserWhereInput = {
    role: "CUSTOMER",
    ...(search && {
      OR: [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const totalCustomers = await prisma.user.count({
    where: { role: "CUSTOMER" },
  });

  const filteredCustomersCount = await prisma.user.count({
    where: whereCondition,
  });

  const totalPages = Math.ceil(filteredCustomersCount / limit);

  const customers = await prisma.user.findMany({
    where: whereCondition,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      createdAt: true,
      status: true,
    },
  });

  return {
    meta: {
      totalCustomers,
      filteredCustomers: filteredCustomersCount,
      totalPages,
      currentPage: page,
    },
    customers,
  };
};
const getAllVendorsFromDB = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
) => {
  const whereCondition: Prisma.UserWhereInput = {
    role: "VENDOR",
    ...(search && {
      OR: [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const totalVendors = await prisma.user.count({
    where: { role: "VENDOR" },
  });

  const filteredVendorsCount = await prisma.user.count({
    where: whereCondition,
  });

  const totalPages = Math.ceil(filteredVendorsCount / limit);

  const vendors = await prisma.user.findMany({
    where: whereCondition,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      createdAt: true,
      status: true,
      vendorProfile: {
        select: {
          id: true,
          farmLocation: true,
          farmName: true,
          certificationStatus: true,
          sustainabilityCert: {
            select: {
              id: true,
              certificationDate: true,
              certifyingAgency: true,
            },
          },
        },
      },
    },
  });

  return {
    meta: {
      totalVendors,
      filteredVendors: filteredVendorsCount,
      totalPages,
      currentPage: page,
    },
    vendors,
  };
};

const approveVendorCertification = async (vendorId: string) => {
  const vendorProfile = await prisma.vendorProfile.findUnique({
    where: { userId: vendorId },
    select: { certificationStatus: true },
  });

  if (!vendorProfile) {
    throw new ApiError(404, "Vendor profile not found");
  }

  if (vendorProfile.certificationStatus !== "NotCertified") {
    throw new ApiError(400, "Vendor is already certified");
  }

  await prisma.vendorProfile.update({
    where: { userId: vendorId },
    data: {
      certificationStatus: "Certified",
    },
  });

  return;
};
const approveProduceCertification = async (produceId: string) => {
  const produce = await prisma.produce.findUnique({
    where: { id: produceId },
    select: { certificationStatus: true },
  });

  if (!produce) {
    throw new ApiError(404, "Produce not found");
  }

  if (produce.certificationStatus !== "NotCertified") {
    throw new ApiError(400, "Produce is already certified");
  }

  await prisma.produce.update({
    where: { id: produceId },
    data: {
      certificationStatus: "Certified",
    },
  });

  return;
};

const getAllNonCertifiedProducesFromDB = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  category?: ProductCategory,
) => {
  const whereCondition: Prisma.ProduceWhereInput = {
    certificationStatus: "NotCertified",
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
    where: { certificationStatus: "NotCertified" },
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
      vendor: {
        select: {
          id: true,
          farmLocation: true,
          farmName: true,
          user: {
            select: {
              id: true,
              fullName: true,
            },
          },
        },
      },
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

export const adminService = {
  getAllCustomersFromDB,
  getAllVendorsFromDB,
  approveVendorCertification,
  approveProduceCertification,
  getAllNonCertifiedProducesFromDB,
};
