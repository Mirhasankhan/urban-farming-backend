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
    },
  });

  const postsWithLikeInfo = posts.map((post) => ({
    id: post.id,
    postContent: post.postContent,
    createdAt: post.createdAt,
    likesCount: post.likes.length,
    likedByUser: post.likes.includes(userId),
  }));

  return postsWithLikeInfo;
};

export const communityPost = {
  createNewPostInDB,
  getAllPostsFromDB,
};
