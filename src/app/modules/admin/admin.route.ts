import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { adminController } from "./admin.controller";

const router = express.Router();

router.get(
  "/all-customers",
  auth(UserRole.ADMIN),
  adminController.allCustomers,
);
router.get(
  "/all-vendors",
  auth(UserRole.ADMIN),
  adminController.allVendors,
);
router.patch(
  "/approve-vendor-certification/:id",
  auth(UserRole.ADMIN),
  adminController.approveVendorCertification,
);

export const adminRoute = router;
