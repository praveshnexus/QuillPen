import { Link } from "react-router-dom";
import { Heart, MessageCircle, Calendar, ArrowUpRight } from "lucide-react";
import type { Post } from "../types/post";
import { Avatar, Badge } from "./ui";

interface PostCardProps {
  post: Post;
  size?: "default" | "large";
}

const COVER_GRADIENTS = [
  "from-indigo-500 via-violet-500 to-purple-600",
  "from-blue-500 via-cyan-500 to-teal-500",
  "from-violet-500 via-fuchsia-500 to-pink-500",
  "from-emerald-500 via-teal-500 to-cyan-600",
  "from-amber-500 via-orange-500 to-red-500",
  "from-rose-500 via-pink-500 to-fuchsia-600",
];

function getCover(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = id.charCodeAt(i) + ((h << 5) - h);
  return COVER_GRADIENTS[Math.abs(h) % COVER_GRADIENTS.length];
}

// Same topic detector as FeaturedPost — reused inline to avoid cross-import
const TOPIC_MAP: { keywords: string[]; icon: string }[] = [
  { keywords: ["react","hook","jsx","tsx","component"], icon: "⚛️" },
  { keywords: ["next","nextjs","ssr"], icon: "▲" },
  { keywords: ["typescript","ts","type","interface"], icon: "🔷" },
  { keywords: ["docker","container","deploy"], icon: "🐳" },
  { keywords: ["ai","gpt","llm","ml","openai"], icon: "🤖" },
  { keywords: ["css","tailwind","design","ui"], icon: "🎨" },
  { keywords: ["node","express","api","backend"], icon: "🟢" },
  { keywords: ["python","django","flask"], icon: "🐍" },
  { keywords: ["database","sql","postgres","prisma"], icon: "🗄️" },
];

function getTopicIcon(title: string, content: string): string | null {
  const text = (title + " " + content).toLowerCase();
  const match = TOPIC_MAP.find(({ keywords }) => keywords.some((k) => text.includes(k)));
  return match ? match.icon : null;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function readingTime(c: string) {
  return `${Math.max(1, Math.round(c.trim().split(/\s+/).length / 200))} min read`;
}

const PostCard = ({ post, size = "default" }: PostCardProps) => {
  const cover = getCover(post.id);
  const isLarge = size === "large";
  const topicIcon = getTopicIcon(post.title, post.content);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-2xl hover:shadow-slate-300/60 hover:border-indigo-200/60">
      {/* Gradient cover */}
      <Link
        to={`/post/${post.slug}`}
        className={`relative flex shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br ${cover} ${isLarge ? "h-44" : "h-28"}`}
      >
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {topicIcon ? (
          <span className={`relative select-none ${isLarge ? "text-5xl" : "text-3xl"}`}>
            {topicIcon}
          </span>
        ) : (
          <span className={`relative font-black text-white/25 select-none ${isLarge ? "text-6xl" : "text-4xl"}`}>
            {post.title.charAt(0).toUpperCase()}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="blue">Article</Badge>
          <span className="text-xs text-slate-400 font-medium">{readingTime(post.content)}</span>
        </div>

        <Link to={`/post/${post.slug}`} className="group/title block mb-3">
          <h2 className={`line-clamp-2 font-bold leading-snug text-slate-900 transition-colors duration-200 group-hover/title:text-indigo-600 ${isLarge ? "text-xl" : "text-lg"}`}>
            {post.title}
          </h2>
        </Link>

        {/* #4 line-clamp-3 everywhere + #5 text-base */}
        <p className="line-clamp-3 flex-1 text-base leading-relaxed text-slate-500">
          {post.content}
        </p>

        <div className="my-5 border-t border-slate-100" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Avatar name={post.author.name} size="sm" />
            <div>
              <p className="text-sm font-semibold text-slate-800 leading-none">{post.author.name}</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                <Calendar size={11} />
                {formatDate(post.createdAt)}
              </div>
            </div>
          </div>

          <Link
            to={`/post/${post.slug}`}
            className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 text-slate-500 transition-all duration-200 hover:bg-indigo-600 hover:text-white hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label={`Read ${post.title}`}
          >
            <ArrowUpRight size={15} />
          </Link>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Heart size={13} className="text-rose-400" />
              {post._count?.likes ?? 0}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <MessageCircle size={13} className="text-blue-400" />
              {post._count?.comments ?? 0}
            </span>
          </div>
          <Link
            to={`/post/${post.slug}`}
            className="text-xs font-bold text-indigo-600 transition-colors duration-200 hover:text-indigo-800 group-hover:underline underline-offset-2"
          >
            Read article →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
