import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { userService } from "./user.services";

// register user
const createPendingUser = catchAsync(async (req: Request, res: Response) => {
  await userService.createPendingUserIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Check your email for OTP and verify your account",
  });
});
// register user
const resendOTP = catchAsync(async (req: Request, res: Response) => {
  await userService.resendVerifyOTP(req.body.email as string);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "OTP resend successfully",
  });
});

// register user
const createUser = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const result = await userService.createUserIntoDB(email, otp);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "User created successfully",
    data: result,
  });
});

//get single user
const getProfile = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getProfileFromDB(req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Profile retrieved successfully",
    data: user,
  });
});





export const UserControllers = {
  createUser,
  createPendingUser,
  getProfile,
  resendOTP,
};
