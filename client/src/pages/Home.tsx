import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import FeaturedPost from "../components/FeaturedPost";
import { useAuth } from "../hooks/useAuth";
import { getAllPosts, searchPosts } from "../services/postService";
import Pagination from "../components/Pagination";
import PostCard from "../components/PostCard";
import { PostCardSkeleton, EmptyState, SectionHeader } from "../components/ui";
import { PenSquare, Inbox } from "lucide-react";
import type { Post } from "../types/post";

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const isSearching = search.trim() !== "";

  const fetchPosts = async (page = 1) => {
    setLoading(true);
    try {
      const data = await getAllPosts(page);
      setPosts(data.posts);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const handleSearch = async () => {
    if (!search.trim()) {
      fetchPosts(1);
      return;
    }
    setLoading(true);
    try {
      const data = await searchPosts(search);
      setPosts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Show the most recent post as "Featured" only on the unfiltered first page —
  // it's drawn from the existing posts list, no new API call.
  const showFeatured = !isSearching && currentPage === 1 && posts.length > 0;
  const featuredPost = showFeatured ? posts[0] : null;
  const gridPosts = showFeatured ? posts.slice(1) : posts;

  // Give every 4th card in the grid a "large" size for visual rhythm
  const sizeFor = (index: number) => (index % 4 === 0 ? "large" : "default");

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Hero */}
        <Hero />

        {/* Search */}
        <div className="mb-10">
          <SearchBar value={search} onChange={setSearch} onSearch={handleSearch} />
        </div>

        {/* Featured post */}
        {!loading && featuredPost && <FeaturedPost post={featuredPost} />}

        {/* Section header */}
        <div id="articles">
          <SectionHeader
            eyebrow="Latest"
            title="Fresh from the community"
            subtitle="Handpicked articles from writers who take their craft seriously."
          />
        </div>

        {/* Posts grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 stagger-children">
            {Array.from({ length: 6 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        ) : gridPosts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <EmptyState
              icon={<Inbox size={32} strokeWidth={1.5} />}
              title={isSearching ? "No results found" : "Nothing here yet"}
              description={
                isSearching
                  ? `No results for "${search}". Try a different keyword.`
                  : "Start writing your first article and share your knowledge with the world."
              }
              action={
                user ? (
                  <Link
                    to="/create-post"
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-200 active:scale-95"
                  >
                    <PenSquare size={16} />
                    Write Story
                  </Link>
                ) : undefined
              }
            />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 stagger-children">
            {gridPosts.map((post, index) => (
              <div
                key={post.id}
                className={sizeFor(index) === "large" ? "sm:col-span-2 xl:col-span-1" : ""}
              >
                <PostCard post={post} size={sizeFor(index)} />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isSearching && !loading && totalPages > 1 && (
          <div className="mt-14 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
