import { Plant, Prisma, RentalSpace } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";

const createRentalSpace = async (vendorId: string, payload: RentalSpace) => {
  const vendorProfile = await prisma.vendorProfile.findUnique({
    where: { userId: vendorId },
  });

  if (!vendorProfile) {
    throw new Error("Vendor profile not found!");
  }

  await prisma.rentalSpace.create({
    data: {
      vendorId: vendorProfile.id,
      location: payload.location,
      price: payload.price,
      size: payload.size,
    },
  });

  return;
};

const getAvailableRentalSpacesFromDB = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
) => {
  const whereCondition: Prisma.RentalSpaceWhereInput = {
    availability: true,
    ...(search && {
      OR: [
        { location: { contains: search, mode: "insensitive" } },
        { size: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const totalRentalSpaces = await prisma.rentalSpace.count({
    where: { availability: true },
  });

  const filteredRentalSpacesCount = await prisma.rentalSpace.count({
    where: whereCondition,
  });

  const totalPages = Math.ceil(filteredRentalSpacesCount / limit);

  const rentalSpaces = await prisma.rentalSpace.findMany({
    where: whereCondition,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      location: true,
      size: true,
      price: true,
      createdAt: true,
      availability: true,
    },
  });

  return {
    meta: {
      totalRentalSpaces,
      filteredRentalSpaces: filteredRentalSpacesCount,
      totalPages,
      currentPage: page,
    },
    rentalSpaces,
  };
};

const applyForRentalSpace = async (userId: string, spaceId: string) => {
  await prisma.rentalSpace.findUniqueOrThrow({
    where: { id: spaceId },
    select: {
      availability: true,
    },
  });

  const existingApplication = await prisma.rentApplication.findFirst({
    where: {
      userId,
      spaceId,
    },
  });

  if (existingApplication) {
    throw new ApiError(400, "You have already applied for this rental space.");
  }

  await prisma.rentApplication.create({
    data: {
      userId,
      spaceId,
    },
  });

  return;
};

const getAllApplicationsForSpace = async (spaceId: string) => {
  const rentalApplications = await prisma.rentApplication.findMany({
    where: { spaceId },
    select: {
      id: true,
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });

  return rentalApplications;
};

const acceptRentalApplication = async (applicationId: string) => {
  const application = await prisma.rentApplication.findUniqueOrThrow({
    where: { id: applicationId },
  });

  await prisma.$transaction(async (tx) => {
    await tx.rentalSpace.update({
      where: { id: application.spaceId },
      data: { availability: false },
    });

    await tx.rentApplication.deleteMany({
      where: { spaceId: application.spaceId },
    });

    await tx.rent.create({
      data: {
        userId: application.userId,
        spaceId: application.spaceId,
      },
    });
  });

  return;
};

const getCustomerWiseRentsFromDB = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId, role: "CUSTOMER" },
  });

  const rents = await prisma.rent.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      space: {
        select: {
          location: true,
          size: true,
          price: true,
        },
      },
      plants: {
        select: {
          id: true,
          plantName: true,
          quantity: true,
          condition: true,
          createdAt: true,
        },
      },
    },
  });

  return rents;
};

const addNewPlantInSpace = async (payload: any) => {
  await prisma.rent.findUniqueOrThrow({
    where: { id: payload.rentId },
  });

  await prisma.plant.create({
    data: {
      plantName: payload.plantName,
      quantity: payload.quantity,
      rentId: payload.rentId,
    },
  });

  return;
};

export const rentService = {
  createRentalSpace,
  getAvailableRentalSpacesFromDB,
  getAllApplicationsForSpace,
  applyForRentalSpace,
  acceptRentalApplication,
  addNewPlantInSpace,
  getCustomerWiseRentsFromDB,
};
