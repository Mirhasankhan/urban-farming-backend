import express from "express";
import { UserControllers } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/register-request",
  validateRequest(userValidation.userRegisterValidationSchema),
  UserControllers.createPendingUser,
);
router.post(
  "/otp-resend",
  validateRequest(userValidation.resendOtpSchema),
  UserControllers.resendOTP,
);
router.post(
  "/verify-account",
  validateRequest(userValidation.signUpVerificationSchema),
  UserControllers.createUser,
);
router.get("/profile", UserControllers.getProfile);

export const userRoutes = router;
