import { Response } from "express";
import { Request } from "express-serve-static-core";
import prisma from "../config/prisma";
import asyncHandler from "../utils/asyncHandler";

interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

export const likePost = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const postId = req.params.postId as string;

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: req.user!.userId,
          postId,
        },
      },
    });

    if (existingLike) {
      return res.status(400).json({
        message: "Post already liked",
      });
    }

    const like = await prisma.like.create({
      data: {
        userId: req.user!.userId,
        postId,
      },
    });

    res.status(201).json({
      message: "Post liked successfully",
      like,
    });
  },
);

export const unlikePost = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const postId = req.params.postId as string;

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: req.user!.userId,
          postId,
        },
      },
    });

    if (!existingLike) {
      return res.status(404).json({
        message: "Like not found",
      });
    }

    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });

    res.status(200).json({
      message: "Post unliked successfully",
    });
  },
);

export const getLikeStatus = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const postId = req.params.postId as string;

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: req.user!.userId,
          postId,
        },
      },
    });
    res.status(200).json({
      liked: !!existingLike,
    });
  },
);

export const getLikeCount = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const postId = req.params.postId as string;

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const count = await prisma.like.count({
      where: {
        postId,
      },
    });
    res.status(200).json({
      likes: count,
    });
  },
);
