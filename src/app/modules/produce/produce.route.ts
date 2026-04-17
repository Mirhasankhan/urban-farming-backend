import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { produceController } from "./produce.controller";
import { produceValidation } from "./produce.validation";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.VENDOR),
  validateRequest(produceValidation.productSchema),
  produceController.createProduce,
);


export const produceRoute = router;
