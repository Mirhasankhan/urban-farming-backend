import { z } from "zod";

const postSchema = z.object({
  postContent: z.string()
});

const commentSchema = z.object({
  postId: z.string().uuid(),
  content: z.string().max(500),
});

const replySchema = z.object({
  commentId: z.string().uuid(),
  content: z.string().max(500),
});

export const communityPostValidation = {
  postSchema,
  commentSchema,
  replySchema,
};