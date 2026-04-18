import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { communityController } from "./community.controller";
import { communityPostValidation } from "./community.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.CUSTOMER),
  validateRequest(communityPostValidation.postSchema),
  communityController.createPost,
);

router.get("/all", auth(UserRole.CUSTOMER), communityController.allPosts);
router.get("/details/:id", auth(UserRole.CUSTOMER), communityController.postDetails);
router.patch(
  "/like-unlike/:id",
  auth(UserRole.CUSTOMER),
  communityController.likeUnlikePost,
);
router.post(
  "/comment",
  auth(UserRole.CUSTOMER),
  validateRequest(communityPostValidation.commentSchema),
  communityController.createComment,
);
router.post(
  "/reply",
  auth(UserRole.CUSTOMER),
  validateRequest(communityPostValidation.replySchema),
  communityController.createReply,
);

export const communityPostRoute = router;
