import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { communityController } from "./community.controller";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.CUSTOMER),
  communityController.createPost,
);


export const communityPostRoute = router;
