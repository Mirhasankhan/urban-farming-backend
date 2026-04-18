import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { produceService } from "./produce.service";
import { ProductCategory } from "@prisma/client";

const createProduce = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  await produceService.createNewProduce(req.user.id, payload);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Produce created successfully.",
  });
});
const certifiedProduces = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string | undefined;
  const category = req.query.category as ProductCategory | undefined;
  const result =await produceService.getAllCertifiedProducesFromDB(
    page,
    limit,
    search,
    category,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Produces retrieved successfully.",
    data: result,
  });
});

export const produceController = {
  createProduce,
  certifiedProduces,
};
