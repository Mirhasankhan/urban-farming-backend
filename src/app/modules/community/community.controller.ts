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
const allPosts = catchAsync(async (req: Request, res: Response) => {
  const posts = await communityPost.getAllPostsFromDB(req.user.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Posts retrieved successfully.",
    data: posts,
  });
});
const postDetails = catchAsync(async (req: Request, res: Response) => {
  const post = await communityPost.getPostDetailsFromDB(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Post retrieved successfully.",
    data: post,
  });
});
const likeUnlikePost = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await communityPost.likeUnlikePostInDB(id, req.user.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
  });
});
const createComment = catchAsync(async (req: Request, res: Response) => {
  await communityPost.createCommentInDB(req.user.id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Comment added successfully.",
  });
});
const createReply = catchAsync(async (req: Request, res: Response) => {
  await communityPost.createReplyInDB(req.user.id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reply added successfully.",
  });
});

export const communityController = {
  createPost,
  allPosts,
  postDetails,
  likeUnlikePost,
  createComment,
  createReply,
};
