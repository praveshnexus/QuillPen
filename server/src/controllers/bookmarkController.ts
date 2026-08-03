// server/src/controllers/bookmarkController.ts

import { Response } from "express";
import { Request } from "express-serve-static-core";
import prisma from "../config/prisma";
import asyncHandler from "../utils/asyncHandler";

interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

// ADD BOOKMARK
export const bookmarkPost = asyncHandler(
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

    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId:{
        userId: req.user!.userId,
        postId,
      } },
    });

    if (existingBookmark) {
      return res.status(400).json({
        message: "Post already bookmarked",
      });
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        userId: req.user!.userId,
        postId,
      },
    });

    res.status(201).json({
      message: "Post bookmarked successfully",
      bookmark,
    });
  },
);

// REMOVE BOOKMARK
export const removeBookmark = asyncHandler(
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

    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId:{
        userId: req.user!.userId,
        postId,
      } },
    });

    if (!existingBookmark) {
      return res.status(404).json({
        message: "Bookmark not found",
      });
    }

    await prisma.bookmark.delete({
      where: {
        id: existingBookmark.id,
      },
    });

    res.status(200).json({
      message: "Bookmark removed successfully",
    });
  },
);

export const getBookmarkStatus = asyncHandler(
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

    

    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: req.user!.userId,
          postId,
        },
      },
    });
      res.status(200).json({
  bookmarked: !!existingBookmark,
});
    },
);



// GET MY BOOKMARKS
export const getMyBookmarks = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const bookmarks = await prisma.bookmark.findMany({
  where: {
    userId: req.user!.userId,
  },
  include: {
    post: {
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },

        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    },
  },
  orderBy: {
    id: "desc",
  },
});

    res.status(200).json(bookmarks);
  },
);
