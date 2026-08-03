import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getSinglePost, deletePost } from "../services/postService";
import { getCommentsByPost } from "../services/commentService";
import CommentForm from "../components/CommentForm";
import CommentCard from "../components/CommentCard";
import LikeButton from "../components/LikeButton";
import BookmarkButton from "../components/BookmarkButton";
import { SinglePostSkeleton, Avatar, EmptyState } from "../components/ui";
import type { Comment } from "../types/comment";
import { useAuth } from "../hooks/useAuth";
import type { Post } from "../types/post";
import {
  ArrowLeft, Pencil, Trash2, Calendar, MessageCircle, Loader2, Clock,
} from "lucide-react";
import toast from "react-hot-toast";

// ─── Cover gradient (same palette as PostCard) ──────────────────────────────
const GRADIENTS = [
  "from-indigo-600 via-violet-600 to-purple-700",
  "from-blue-600 via-cyan-500 to-teal-600",
  "from-rose-600 via-pink-600 to-fuchsia-700",
  "from-emerald-600 via-teal-500 to-cyan-600",
  "from-amber-500 via-orange-500 to-red-600",
];
function getCover(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = id.charCodeAt(i) + ((h << 5) - h);
  return GRADIENTS[Math.abs(h) % GRADIENTS.length];
}

// ─── Topic detection ─────────────────────────────────────────────────────────
const TOPIC_MAP: { keywords: string[]; icon: string; label: string }[] = [
  { keywords: ["react","hook","jsx","tsx"], icon: "⚛️", label: "React" },
  { keywords: ["next","nextjs","ssr"], icon: "▲", label: "Next.js" },
  { keywords: ["typescript","ts","type"], icon: "🔷", label: "TypeScript" },
  { keywords: ["docker","container","deploy"], icon: "🐳", label: "Docker" },
  { keywords: ["ai","gpt","llm","ml"], icon: "🤖", label: "AI" },
  { keywords: ["css","tailwind","design","ui"], icon: "🎨", label: "Design" },
  { keywords: ["node","express","api","backend"], icon: "🟢", label: "Node.js" },
  { keywords: ["python","django","flask"], icon: "🐍", label: "Python" },
  { keywords: ["database","sql","postgres"], icon: "🗄️", label: "Database" },
];
function detectTopics(title: string, content: string) {
  const text = (title + " " + content).toLowerCase();
  return TOPIC_MAP.filter(({ keywords }) => keywords.some((k) => text.includes(k))).slice(0, 3);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}
function readingTime(c: string) {
  return `${Math.max(1, Math.round(c.trim().split(/\s+/).length / 200))} min read`;
}

// ─── Reading progress bar ────────────────────────────────────────────────────
function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-slate-200/50">
      <div
        className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-600 transition-all duration-75"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
const SinglePost = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      try {
        const data = await getSinglePost(slug);
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchPost();
  }, [slug]);

  const fetchComments = async () => {
    if (!post) return;
    try {
      const data = await getCommentsByPost(post.id);
      setComments(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (post) fetchComments();
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <ReadingProgress />
        <SinglePostSkeleton />
      </div>
    );
  }

  const isAuthor = user?.id === post.author.id;
  const gradient = getCover(post.id);
  const topics = detectTopics(post.title, post.content);

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    try {
      setDeleting(true);
      await deletePost(post.id);
      toast.success("Article deleted");
      navigate("/");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete article");
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <ReadingProgress />

      {/* Sticky sub-nav */}
      <div className="border-b border-slate-100 bg-white/90 backdrop-blur-md sticky top-[61px] z-40">
        <div className="mx-auto max-w-4xl px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors duration-150 rounded-lg px-2 py-1.5 hover:bg-slate-100"
          >
            <ArrowLeft size={15} />
            Back to articles
          </button>

          {isAuthor && (
            <div className="flex items-center gap-2">
              <Link
                to={`/edit-post/${post.id}`}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all"
              >
                <Pencil size={14} />
                Edit
              </Link>
              {confirmDelete ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-red-600">Delete?</span>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60 transition-all"
                  >
                    {deleting && <Loader2 size={13} className="animate-spin" />}
                    {deleting ? "Deleting…" : "Yes, delete"}
                  </button>
                  <button onClick={() => setConfirmDelete(false)} className="text-sm text-slate-500 hover:text-slate-700 px-2 transition-colors">
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-100 hover:border-red-300 transition-all"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Article */}
      <article className="mx-auto max-w-3xl px-6 pt-12 pb-20">

        {/* Category badge */}
        <div className="mb-5">
          {topics.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {topics.map(({ icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600 ring-1 ring-indigo-100"
                >
                  {icon} {label}
                </span>
              ))}
            </div>
          ) : (
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-indigo-600 ring-1 ring-indigo-100">
              Article
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.1] text-slate-900 mb-8">
          {post.title}
        </h1>

        {/* Author + date + actions */}
        <div className="flex items-center justify-between flex-wrap gap-4 py-5 border-y border-slate-200 mb-10">
          <div className="flex items-center gap-3">
            <Avatar name={post.author.name} size="lg" />
            <div>
              <p className="font-bold text-slate-900">{post.author.name}</p>
              <div className="flex items-center gap-2 mt-0.5 text-sm text-slate-400">
                <Calendar size={13} />
                <span>{formatDate(post.createdAt)}</span>
                <span>·</span>
                <Clock size={13} />
                <span>{readingTime(post.content)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <LikeButton postId={post.id} />
            <BookmarkButton postId={post.id} />
          </div>
        </div>

        {/* Large gradient cover image */}
        <div
          className={`relative flex h-64 sm:h-80 w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} mb-12 shadow-lg`}
        >
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.9) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          {topics.length > 0 ? (
            <div className="relative flex flex-wrap justify-center gap-3">
              {topics.map(({ icon, label }) => (
                <span
                  key={label}
                  className="flex items-center gap-2 rounded-full bg-white/15 border border-white/30 backdrop-blur-sm px-5 py-2 text-base font-bold text-white shadow-sm"
                >
                  <span className="text-xl">{icon}</span>
                  {label}
                </span>
              ))}
            </div>
          ) : (
            <span className="relative text-9xl font-black text-white/20 select-none">
              {post.title.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Article body */}
        <div className="article-body">
          {post.content.split("\n\n").map((para, i) => (
            <p key={i} className="mb-6 text-[1.0625rem] leading-[1.9] text-slate-700">
              {para}
            </p>
          ))}
        </div>

        {/* End divider */}
        <div className="my-14 flex items-center gap-4">
          <div className="flex-1 border-t border-slate-200" />
          <span className="text-slate-300 text-xl">✦</span>
          <div className="flex-1 border-t border-slate-200" />
        </div>

        {/* Bottom actions — repeated for convenience */}
        <div className="flex items-center gap-3 mb-14">
          <LikeButton postId={post.id} />
          <BookmarkButton postId={post.id} />
        </div>

        {/* Comments */}
        <section aria-labelledby="comments-heading">
          <div className="flex items-center gap-3 mb-7">
            <MessageCircle size={20} className="text-indigo-500" />
            <h2 id="comments-heading" className="text-xl font-bold text-slate-900">
              {comments.length === 0
                ? "No comments yet"
                : `${comments.length} ${comments.length === 1 ? "Comment" : "Comments"}`}
            </h2>
          </div>

          <CommentForm postId={post.id} onCommentAdded={fetchComments} />

          {comments.length === 0 ? (
            <div className="mt-8">
              <EmptyState
                icon={<MessageCircle size={28} strokeWidth={1.5} />}
                title="Start the conversation"
                description="Be the first to share your thoughts on this article."
              />
            </div>
          ) : (
            <div className="mt-6 flex flex-col gap-4">
              {comments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  postId={post.id}
                  currentUserId={user?.id}
                  onDelete={fetchComments}
                />
              ))}
            </div>
          )}
        </section>
      </article>
    </div>
  );
};

export default SinglePost;
