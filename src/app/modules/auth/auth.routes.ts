import express from "express";
import { authController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { authValidation } from "./auth.validation";
import auth from "../../middlewares/auth";
import rateLimiter from "../../middlewares/rateLimiter";

const router = express.Router();

//login user
router.post(
  "/login",
  rateLimiter(1, 3),
  validateRequest(authValidation.loginSchema),
  authController.loginUser,
);
router.post(
  "/send-otp",
  rateLimiter(1, 2),
  validateRequest(authValidation.sendOtpSchema),
  authController.sendForgotPasswordOtp,
);
router.post(
  "/verify-otp",
  rateLimiter(1, 3),

  validateRequest(authValidation.verifyOtpSchema),
  authController.verifyForgotPasswordOtpCode,
);
router.patch(
  "/reset-password",
  rateLimiter(1, 3),
  validateRequest(authValidation.resetPasswordSchema),
  auth(),
  authController.resetPassword,
);
router.patch(
  "/change-password",

  validateRequest(authValidation.changePasswordSchema),
  auth(),
  authController.changePassword,
);
router.patch("/mark-active/:id", authController.markActive);

export const authRoute = router;
