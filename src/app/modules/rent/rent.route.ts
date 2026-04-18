import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { rentController } from "./rent.controller";
import validateRequest from "../../middlewares/validateRequest";
import { rentValidation } from "./rent.validation";

const router = express.Router();

router.post(
  "/create-space",
  auth(UserRole.VENDOR),
  validateRequest(rentValidation.rentalSpaceSchema),
  rentController.createRentalSpace,
);
router.get(
  "/available-spaces",
  auth(UserRole.CUSTOMER),  
  rentController.availableRentalSpaces,
);
router.post(
  "/apply",
  auth(UserRole.CUSTOMER),
  validateRequest(rentValidation.applicationSchema),
  rentController.applyForRentalSpace,
);
router.get(
  "/applications/:id",
  auth(UserRole.VENDOR),
  rentController.applicationsForSpace,
);
router.patch(
  "/accept-application/:id",
  auth(UserRole.VENDOR),
  rentController.acceptApplication,
);
router.get(
  "/customer-wise",
  auth(UserRole.CUSTOMER),
  rentController.customerWiseRents,
);
router.post(
  "/add-plant",
  auth(UserRole.CUSTOMER),
  validateRequest(rentValidation.plantSchema),
  rentController.addNewPlant,
);

export const rentRoute = router;
