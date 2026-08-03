import redisClient from "../config/redis";

/**
 * TTLs (seconds). Chosen per data shape, not copy-pasted:
 *  - POSTS_LIST / SEARCH are short because they embed `_count.likes` /
 *    `_count.comments`, which change every time someone likes or comments -
 *    endpoints this project does not (and should not) invalidate this cache
 *    on, since that would mean a Redis write on every single like/comment.
 *    A short TTL bounds that staleness to a max of 60s instead.
 *  - SINGLE_POST is longer because the single-post response contains no
 *    counts at all (see postController.getSinglePost) - it only goes stale
 *    when the post's title/content/slug actually changes, which IS
 *    explicitly invalidated below, so a longer TTL is free upside.
 */
export const CACHE_TTL = {
  POSTS_LIST: 60,
  SEARCH: 60,
  SINGLE_POST: 300,
} as const;

const POSTS_VERSION_KEY = "posts:version";

/**
 * Core cache-aside primitive used by every cached read in the app:
 *   1. Cache hit  -> return cached value, skip the database entirely.
 *   2. Cache miss -> run `fetcher` (the real DB query), store the result,
 *      return it.
 *   3. Redis down/erroring -> behave exactly like a cache miss. The caller
 *      never needs its own try/catch around Redis; this is the single choke
 *      point where "Redis is optional" is enforced.
 *
 * Falsy "not found" results (null/undefined) are intentionally never cached,
 * so a 404 for a not-yet-existing slug can't shadow the real post once it's
 * created.
 */
export async function getOrSetCache<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>,
): Promise<{ data: T; cacheHit: boolean }> {
  if (redisClient.isReady) {
    try {
      const cached = await redisClient.get(key);
      if (cached !== null) {
        return { data: JSON.parse(cached) as T, cacheHit: true };
      }
    } catch (error) {
      console.error(
        `[Cache] GET failed for key "${key}", falling back to database:`,
        (error as Error).message,
      );
    }
  }

  const data = await fetcher();

  if (redisClient.isReady && data !== null && data !== undefined) {
    try {
      await redisClient.setEx(key, ttlSeconds, JSON.stringify(data));
    } catch (error) {
      console.error(
        `[Cache] SET failed for key "${key}":`,
        (error as Error).message,
      );
    }
  }

  return { data, cacheHit: false };
}

/** Directly invalidates one or more known cache keys (used for single-post caches, where we know the exact key at write time). */
export async function deleteCacheKeys(keys: string[]): Promise<void> {
  if (!redisClient.isReady || keys.length === 0) return;
  try {
    await redisClient.del(keys);
  } catch (error) {
    console.error(
      `[Cache] DEL failed for keys [${keys.join(", ")}]:`,
      (error as Error).message,
    );
  }
}

/**
 * Reads the current "generation" of list-shaped caches (paginated post
 * listings, search results).
 */
export async function getPostsVersion(): Promise<number> {
  if (!redisClient.isReady) return 0;
  try {
    const version = await redisClient.get(POSTS_VERSION_KEY);
    return version ? parseInt(version, 10) : 0;
  } catch (error) {
    console.error(
      "[Cache] Failed to read posts version:",
      (error as Error).message,
    );
    return 0;
  }
}

/**
 * Bumps the list-cache generation. Called after any create/update/delete of
 * a post. Every list/search cache key embeds this version number
 * (see `cacheKeys` below), so incrementing it instantly makes every
 * previously-cached listing/search response unreachable under the new
 * version - a fresh version number means a guaranteed cache miss - without
 * running a blocking KEYS/SCAN + DEL across a potentially large keyspace.
 * The old, now-unreachable keys simply expire on their own via TTL.
 */
export async function bumpPostsVersion(): Promise<void> {
  if (!redisClient.isReady) return;
  try {
    await redisClient.incr(POSTS_VERSION_KEY);
  } catch (error) {
    console.error(
      "[Cache] Failed to bump posts version:",
      (error as Error).message,
    );
  }
}

export const cacheKeys = {
  postsList: (version: number, page: number, limit: number) =>
    `posts:v${version}:page:${page}:limit:${limit}`,
  search: (version: number, query: string) =>
    `search:v${version}:${query.toLowerCase()}`,
  postBySlug: (slug: string) => `post:slug:${slug}`,
  postById: (id: string) => `post:id:${id}`,
};
