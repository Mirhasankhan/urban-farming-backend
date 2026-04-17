import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { communityPost } from "./community.service";
import sendResponse from "../../../shared/sendResponse";

const createPost = catchAsync(async (req: Request, res: Response) => {
  await communityPost.createNewPostInDB(req.user.id, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Post created successfully.",
  });
});

export const communityController = {
  createPost,
};
