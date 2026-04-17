import { z } from "zod";
const roleEnum = z.enum(["VENDOR", "CUSTOMER"]);

const userRegisterValidationSchema = z.object({
  fullName: z.string().min(1, "User name is required"),
  email: z.string().email("Invalid email address"),
  role: roleEnum,
  password: z.string().min(1, "Password is required"),
});
const signUpVerificationSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z
    .string()
    .min(4, "OTP is required")
    .max(4, "OTP must be at most 4 characters long"),
});
const resendOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const userUpdateValidationSchema = z.object({
  fullName: z.string().min(1, "User name is required").optional(),
  phone: z.string().min(8, "Phone number at least 8 digit long").optional(),
});

export const userValidation = {
  userRegisterValidationSchema,
  signUpVerificationSchema,
  userUpdateValidationSchema,
  resendOtpSchema,
};
