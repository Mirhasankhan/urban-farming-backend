import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { adminService } from "./admin.service";
import sendResponse from "../../../shared/sendResponse";
import { ProductCategory } from "@prisma/client";

const allCustomers = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string | undefined;

  const result = await adminService.getAllCustomersFromDB(page, limit, search);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Customers retrieved successfully.",
    data: result,
  });
});
const allVendors = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string | undefined;

  const result = await adminService.getAllVendorsFromDB(page, limit, search);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Vendors retrieved successfully.",
    data: result,
  });
});
const approveVendorCertification = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    await adminService.approveVendorCertification(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Vendor certified successfully.",
    });
  },
);
const approveProduceCertification = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    await adminService.approveProduceCertification(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Produce certified successfully.",
    });
  },
);

const nonCertifiedProduces = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string | undefined;
  const category = req.query.category as ProductCategory | undefined;
  const result = await adminService.getAllNonCertifiedProducesFromDB(
    page,
    limit,
    search,
    category,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Non-certified produces retrieved successfully.",
    data: result,
  });
});

export const adminController = {
  allCustomers,
  allVendors,
  approveVendorCertification,
  approveProduceCertification,
  nonCertifiedProduces,
};
