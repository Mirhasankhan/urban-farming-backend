import express from "express";
import { UserControllers } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import rateLimiter from "../../middlewares/rateLimiter";

const router = express.Router();

router.post(
  "/register-request",
  validateRequest(userValidation.userRegisterValidationSchema),
  UserControllers.createPendingUser,
);
router.post(
  "/otp-resend",
  rateLimiter(1, 2),
  validateRequest(userValidation.resendOtpSchema),
  UserControllers.resendOTP,
);
router.post(
  "/verify-account",
  rateLimiter(1, 3),
  validateRequest(userValidation.signUpVerificationSchema),
  UserControllers.createUser,
);
router.get(
  "/profile",
  rateLimiter(1, 5),
  UserControllers.getProfile
);

export const userRoutes = router;
