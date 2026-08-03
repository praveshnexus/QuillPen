import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyBookmarks } from "../services/bookmarkService";
import PostCard from "../components/PostCard";
import { PostCardSkeleton, EmptyState, SectionHeader } from "../components/ui";
import { Bookmark, Compass } from "lucide-react";
import type { Post } from "../types/post";

const Bookmarks = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const data = await getMyBookmarks();

      // Change this if your backend returns a different key
      setPosts(data.map((bookmark: { post: Post }) => bookmark.post));
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <SectionHeader
          eyebrow="Saved"
          title="My reading list"
          subtitle="Articles you've bookmarked to read later."
        />

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
            {Array.from({ length: 3 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <EmptyState
              icon={<Bookmark size={36} strokeWidth={1.5} />}
              title="No bookmarks yet"
              description="Save articles you want to revisit later — they'll show up right here."
              action={
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-200 active:scale-95"
                >
                  <Compass size={16} />
                  Discover articles
                </Link>
              }
            />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
