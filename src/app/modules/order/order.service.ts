import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";

const createNewOrderInDB = async (userId: string, payload: any) => {
  const customer = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
      role: "CUSTOMER",
    },
  });

  const produce = await prisma.produce.findUniqueOrThrow({
    where: {
      id: payload.produceId,
    },
  });

  if (produce.availableQuantity < payload.quantity) {
    throw new ApiError(400, "Not enough quantity available");
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.create({
      data: {
        customerId: customer.id,
        produceId: produce.id,
        quantity: payload.quantity,
        subtotal: payload.quantity * produce.price,
        status: "Pending",
      },
    });

    await tx.produce.update({
      where: {
        id: produce.id,
      },
      data: {
        availableQuantity: {
          decrement: payload.quantity,
        },
      },
    });
  });

  return;
};

const getCustomerOrdersFromDB = async (userId: string) => {
  const customer = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
      role: "CUSTOMER",
    },
  });
  const orders = await prisma.order.findMany({
    where: {
      customerId: customer.id,
    },
    select: {
      id: true,
      quantity: true,
      subtotal: true,
      status: true,
      produce: {
        select: {
          id: true,
          name: true,
          price: true,
          category: true,
          vendor: {
            select: {
              farmName: true,
              farmLocation: true,
              user: {
                select: {
                    fullName: true,
                }
              }
            },
          },
        },
      },
    },
  });
  return orders;
};

export const orderService = {
  createNewOrderInDB,
  getCustomerOrdersFromDB,
};
