import { Response } from "express";
import { Request } from "express-serve-static-core";
import prisma from "../config/prisma";
import asyncHandler from "../utils/asyncHandler";
import { createPostSchema } from "../validators/postValidator";
import {
  getOrSetCache,
  deleteCacheKeys,
  getPostsVersion,
  bumpPostsVersion,
  cacheKeys,
  CACHE_TTL,
} from "../utils/cache";

interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

export const createPost = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const validation = createPostSchema.safeParse(req.body);

    if (!validation.success) {
      console.log(validation.error.issues);

      return res.status(400).json({
        errors: validation.error.issues,
      });
    }
    const { title, content } = req.body;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        slug: title.toLowerCase().replace(/\s+/g, "-"),
        authorId: req.user!.userId,
      },
    });

    // A new post changes every paginated listing and every search result
    // that would now include it - bump the shared version so cached
    // listings/search responses are no longer reachable.
    await bumpPostsVersion();

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  },
);

export const getAllPosts = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  // NOTE: this same response also serves as the "Featured post" data -
  // FeaturedPost.tsx (frontend) simply reads posts[0] out of page 1. There
  // is no separate featured-post endpoint or cache key; caching this
  // listing IS caching the featured post.
  const version = await getPostsVersion();
  const cacheKey = cacheKeys.postsList(version, page, limit);

  const { data, cacheHit } = await getOrSetCache(
    cacheKey,
    CACHE_TTL.POSTS_LIST,
    async () => {
      const totalPosts = await prisma.post.count();
      const totalPages = Math.ceil(totalPosts / limit);

      const posts = await prisma.post.findMany({
        skip,
        take: limit,
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

        orderBy: {
          createdAt: "desc",
        },
      });

      return { posts, currentPage: page, totalPages, totalPosts };
    },
  );

  // Informational only - purely additive header, no existing client code
  // reads or depends on it. Makes cache behavior visible in devtools/curl.
  res.setHeader("X-Cache", cacheHit ? "HIT" : "MISS");
  res.status(200).json(data);
});

export const getSinglePost = asyncHandler(
  async (req: Request, res: Response) => {
    const slug = req.params.slug as string;

    const { data: post, cacheHit } = await getOrSetCache(
      cacheKeys.postBySlug(slug),
      CACHE_TTL.SINGLE_POST,
      () =>
        prisma.post.findUnique({
          where: {
            slug,
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        }),
    );

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.setHeader("X-Cache", cacheHit ? "HIT" : "MISS");
    res.status(200).json(post);
  },
);

export const getSinglePostID = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const { data: post, cacheHit } = await getOrSetCache(
      cacheKeys.postById(id),
      CACHE_TTL.SINGLE_POST,
      () =>
        prisma.post.findUnique({
          where: {
            id,
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        }),
    );

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.setHeader("X-Cache", cacheHit ? "HIT" : "MISS");
    res.status(200).json(post);
  },
);

export const updatePost = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const validation = createPostSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        errors: validation.error.issues,
      });
    }
    const { title, content } = req.body;
    const id = req.params.id as string;

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.authorId !== req.user!.userId) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const oldSlug = post.slug;

    const updatedPost = await prisma.post.update({
      where: {
        id,
      },
      data: {
        title,
        content,
        slug: title.toLowerCase().replace(/\s+/g, "-"),
      },
    });

    // Directly invalidate this post's own cache entries. The slug can
    // change on update (it's re-derived from the new title), so the OLD
    // slug key would otherwise keep serving stale content for up to
    // CACHE_TTL.SINGLE_POST seconds even though it's no longer reachable
    // via any link - explicitly delete it rather than rely on TTL alone.
    await deleteCacheKeys([
      cacheKeys.postBySlug(oldSlug),
      cacheKeys.postBySlug(updatedPost.slug),
      cacheKeys.postById(id),
    ]);
    // Title/content changed, which is visible in every listing/search
    // result - bump the shared version so those go stale immediately too.
    await bumpPostsVersion();

    res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost,
    });
  },
);

export const deletePost = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.authorId !== req.user!.userId) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    await prisma.post.delete({
      where: {
        id,
      },
    });

    await deleteCacheKeys([cacheKeys.postBySlug(post.slug), cacheKeys.postById(id)]);
    await bumpPostsVersion();

    res.status(200).json({
      message: "Post deleted successfully",
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

export const searchPosts = asyncHandler(async (req: Request, res: Response) => {
  const query = (req.query.query as string)?.trim();

  if (!query) {
    return res.status(400).json({
      message: "Search query is required",
    });
  }

  const version = await getPostsVersion();
  const cacheKey = cacheKeys.search(version, query);

  const { data: posts, cacheHit } = await getOrSetCache(
    cacheKey,
    CACHE_TTL.SEARCH,
    () =>
      prisma.post.findMany({
        where: {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
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
        orderBy: {
          createdAt: "desc",
        },
      }),
  );

  res.setHeader("X-Cache", cacheHit ? "HIT" : "MISS");
  res.status(200).json(posts);
});
