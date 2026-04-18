import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { rentService } from "./rent.service";
import sendResponse from "../../../shared/sendResponse";

const createRentalSpace = catchAsync(async (req: Request, res: Response) => {
  await rentService.createRentalSpace(req.user.id, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Rental space created successfully.",
  });
});
const availableRentalSpaces = catchAsync(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;

    const result = await rentService.getAvailableRentalSpacesFromDB(
      page,
      limit,
      search,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Available rental spaces retrieved successfully.",
      data: result,
    });
  },
);
const applyForRentalSpace = catchAsync(async (req: Request, res: Response) => {
  await rentService.applyForRentalSpace(req.user.id, req.body.spaceId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Application for rental space submitted successfully.",
  });
});
const applicationsForSpace = catchAsync(async (req: Request, res: Response) => {
  const result = await rentService.getAllApplicationsForSpace(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Applications for rental space retrieved successfully.",
    data: result,
  });
});
const acceptApplication = catchAsync(async (req: Request, res: Response) => {
  await rentService.acceptRentalApplication(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Rental application accepted successfully.",
  });
});

const customerWiseRents = catchAsync(async (req: Request, res: Response) => {
  const rents = await rentService.getCustomerWiseRentsFromDB(req.user.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Customer-wise rents retrieved successfully.",
    data: rents,
  });
});

const addNewPlant = catchAsync(async (req: Request, res: Response) => {
  await rentService.addNewPlantInSpace(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Plant added successfully.",
  });
});

export const rentController = {
  createRentalSpace,
  availableRentalSpaces,
  applyForRentalSpace,
  applicationsForSpace,
  acceptApplication,
  addNewPlant,
  customerWiseRents,
};
