import { Response } from "express";
import { Request } from "express-serve-static-core";
import prisma from "../config/prisma";
import { commentSchema } from "../validators/commentValidator";
import asyncHandler from "../utils/asyncHandler";

interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

export const createComment = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const validation = commentSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        errors: validation.error.issues,
      });
    }
    const { content } = req.body;
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

    const comment = await prisma.comment.create({
      data: {
        content,
        userId: req.user!.userId,
        postId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Comment added successfully",
      comment,
    });
  },
);

export const getCommentsByPost = asyncHandler(
  async (req: Request, res: Response) => {
    const postId = req.params.postId as string;

    const comments = await prisma.comment.findMany({
      where: {
        postId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(comments);
  },
);

export const deleteComment = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const commentId = req.params.commentId as string;

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (comment.userId !== req.user!.userId) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    res.status(200).json({
      message: "Comment deleted successfully",
    });
  },
);
