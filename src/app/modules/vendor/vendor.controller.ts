import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { vendorService } from "./vendor.service";
import sendResponse from "../../../shared/sendResponse";

const setupVendorProfile = catchAsync(async (req: Request, res: Response) => {
  await vendorService.setupVendorProfile(req.user.id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Vendor profile setup successfully",
  });
});
const addSustainabilityCertificate = catchAsync(
  async (req: Request, res: Response) => {
    await vendorService.addSustainabilityCertificate(req.user.id, req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Sustainability certificate added successfully",
    });
  },
);

export const vendorController = {
  setupVendorProfile,
  addSustainabilityCertificate,
};
