import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { orderService } from "./order.service";

const createOrder = catchAsync(async (req: Request, res: Response) => {
  await orderService.createNewOrderInDB(req.user.id, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Order created successfully.",
  });
});

const customerWiseOrders = catchAsync(async (req: Request, res: Response) => {
  const orders = await orderService.getCustomerOrdersFromDB(req.user.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: orders,
    message: "Order created successfully.",
  });
});

export const orderController = {
  createOrder,
  customerWiseOrders,
};
