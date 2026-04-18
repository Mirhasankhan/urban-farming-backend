import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { orderController } from "./order.controller";
import validateRequest from "../../middlewares/validateRequest";
import { orderValidation } from "./order.validation";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.CUSTOMER),
  validateRequest(orderValidation.orderSchema),
  orderController.createOrder,
);
router.get(
  "/customer-wise",
  auth(UserRole.CUSTOMER),
  orderController.customerWiseOrders,
);

export const orderRoute = router;
