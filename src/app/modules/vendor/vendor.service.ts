import { SustainabilityCert, UserRole, VendorProfile } from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";

const setupVendorProfile = async (userId: string, payload: VendorProfile) => {
  const user = await prisma.user.findUnique({
    where: { id: userId, role: UserRole.VENDOR },
    include: { vendorProfile: true },
  });
  if (!user) {
    throw new ApiError(404, "Vendor not found!");
  }

  if (user.vendorProfile) {
    throw new ApiError(400, "Vendor profile already exists.");
  }

  await prisma.vendorProfile.create({
    data: {
      userId,
      farmName: payload.farmName,
      farmLocation: payload.farmLocation,
    },
  });

  return;
};

const addSustainabilityCertificate = async (
  vendorId: string,
  payload: SustainabilityCert,
) => {
  const vendorProfile = await prisma.vendorProfile.findUnique({
    where: { userId: vendorId },
  });

  if (!vendorProfile) {
    throw new ApiError(404, "Vendor profile not found!");
  }

  await prisma.sustainabilityCert.create({
    data: {
      vendorId:vendorProfile.id,
      certificationDate: payload.certificationDate,
      certifyingAgency: payload.certifyingAgency,
    },
  });

  return;
};

export const vendorService = {
  setupVendorProfile,
  addSustainabilityCertificate,
};
