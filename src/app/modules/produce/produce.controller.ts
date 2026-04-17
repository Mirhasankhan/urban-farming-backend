import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { produceService } from "./produce.service";

const createProduce = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  await produceService.createNewProduce(req.user.id, payload);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Produce created successfully.",
  });
});

export const produceController = {
  createProduce,
};
