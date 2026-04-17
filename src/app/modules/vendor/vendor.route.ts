import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { vendorController } from "./vendor.controller";
import { vendorValidation } from "./vendor.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

//setup vendor profile
router.post(
  "/setup-profile",
  auth(UserRole.VENDOR),
  validateRequest(vendorValidation.setupProfileSchema),
  vendorController.setupVendorProfile,
);
router.post(
  "/add-sustainability-certificate",
  auth(UserRole.VENDOR),
  validateRequest(vendorValidation.sustainabilityCertificateSchema),
  vendorController.addSustainabilityCertificate,
);

export const vendorRoute = router;
