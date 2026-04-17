import { Produce } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";

const createNewProduce = async (vendorId: string, payload: Produce) => {
  const vendorProfile = await prisma.vendorProfile.findUnique({
    where: { userId: vendorId },
  });

  if (!vendorProfile) {
    throw new ApiError(404, "Vendor profile not found!");
  }

//   if (vendorProfile.certificationStatus == "NotCertified") {
//     throw new ApiError(403, "Vendor is not certified to add produce!");
//   }

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

export const produceService = {
  createNewProduce,
};
