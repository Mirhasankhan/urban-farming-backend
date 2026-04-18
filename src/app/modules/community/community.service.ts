import { CommunityPost } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";

const createNewPostInDB = async (userId: string, payload: CommunityPost) => {
  const user = await prisma.user.findUnique({
    where: { id: userId, role: "CUSTOMER" },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await prisma.communityPost.create({
    data: {
      postContent: payload.postContent,
      userId,
    },
  });

  return;
};

const getAllPostsFromDB = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId, role: "CUSTOMER" },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const posts = await prisma.communityPost.findMany({
    select: {
      id: true,
      postContent: true,
      createdAt: true,
      likes: true,
      _count: {
        select: {
          comment: true,
        },
      },
      user: {
        select: {
          fullName: true,
        },
      },
    },
  });

  const postsWithLikeInfo = posts.map((post) => ({
    id: post.id,
    postContent: post.postContent,
    createdAt: post.createdAt,
    likesCount: post.likes.length,
    isLiked: post.likes.includes(userId),
    authorName: post.user.fullName,
    totalComment: post._count.comment,
  }));

  return postsWithLikeInfo;
};

const getPostDetailsFromDB = async (postId: string) => {
  const post = await prisma.communityPost.findUniqueOrThrow({
    where: { id: postId },
    select: {
      id: true,
      postContent: true,
      createdAt: true,
      comment: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          user: {
            select: {
              fullName: true,
            },
          },
          replies: {
            select: {
              id: true,
              content: true,
              createdAt: true,
              user: {
                select: {
                  fullName: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return post;
};

const likeUnlikePostInDB = async (postId: string, userId: string) => {
  await prisma.user.findUniqueOrThrow({
    where: { id: userId },
  });

  const post = await prisma.communityPost.findUniqueOrThrow({
    where: { id: postId },
  });

  const isLiked = post.likes.includes(userId);
  await prisma.communityPost.update({
    where: { id: postId },
    data: {
      likes: isLiked
        ? post.likes.filter((id) => id !== userId)
        : [...post.likes, userId],
    },
  });

  return {
    message: isLiked ? "Post unliked successfully" : "Post liked successfully",
  };
};

const createCommentInDB = async (userId: string, payload: any) => {
  await prisma.user.findUniqueOrThrow({
    where: { id: userId },
  });

  await prisma.communityPost.findUniqueOrThrow({
    where: { id: payload.postId },
  });

  await prisma.comment.create({
    data: {
      userId,
      postId: payload.postId,
      content: payload.content,
    },
  });

  return;
};

const createReplyInDB = async (userId: string, payload: any) => {
  await prisma.user.findUniqueOrThrow({
    where: { id: userId },
  });

  await prisma.comment.findUniqueOrThrow({
    where: { id: payload.commentId },
  });

  await prisma.reply.create({
    data: {
      userId,
      commentId: payload.commentId,
      content: payload.content,
    },
  });

  return;
};

export const communityPost = {
  createNewPostInDB,
  getAllPostsFromDB,
  likeUnlikePostInDB,
  createCommentInDB,
  createReplyInDB,
  getPostDetailsFromDB,
  
};
