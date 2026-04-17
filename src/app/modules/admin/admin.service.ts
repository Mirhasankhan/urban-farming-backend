import { Prisma } from "@prisma/client";
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

  return
};

export const adminService = {
  getAllCustomersFromDB,
  getAllVendorsFromDB,
  approveVendorCertification,
  
};
