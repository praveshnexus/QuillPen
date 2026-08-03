import { Link } from "react-router-dom";
import { Heart, MessageCircle, Calendar, ArrowRight, Star } from "lucide-react";
import type { Post } from "../types/post";
import { Avatar } from "./ui";

interface FeaturedPostProps {
  post: Post;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function readingTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

// Deterministic cover gradient per post id
const GRADIENTS = [
  ["from-indigo-600 via-violet-600 to-purple-700", "bg-indigo-500/30"],
  ["from-blue-600 via-cyan-500 to-teal-600", "bg-cyan-500/30"],
  ["from-rose-600 via-pink-600 to-fuchsia-700", "bg-pink-500/30"],
  ["from-emerald-600 via-teal-500 to-cyan-600", "bg-teal-500/30"],
  ["from-amber-500 via-orange-500 to-red-600", "bg-orange-500/30"],
];
function getCover(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = id.charCodeAt(i) + ((h << 5) - h);
  return GRADIENTS[Math.abs(h) % GRADIENTS.length];
}

// Topic keywords → icon emoji, for rich cover display
const TOPIC_MAP: { keywords: string[]; icon: string; label: string }[] = [
  { keywords: ["react","hook","component","jsx","tsx"], icon: "⚛️", label: "React" },
  { keywords: ["next","nextjs","ssr","server"], icon: "▲", label: "Next.js" },
  { keywords: ["typescript","ts","type","interface"], icon: "🔷", label: "TypeScript" },
  { keywords: ["docker","container","devops","deploy"], icon: "🐳", label: "Docker" },
  { keywords: ["ai","gpt","llm","openai","ml","machine"], icon: "🤖", label: "AI" },
  { keywords: ["css","tailwind","style","design","ui"], icon: "🎨", label: "Design" },
  { keywords: ["node","express","api","backend","server"], icon: "🟢", label: "Node.js" },
  { keywords: ["python","django","flask","script"], icon: "🐍", label: "Python" },
  { keywords: ["git","github","version","commit"], icon: "🔀", label: "Git" },
  { keywords: ["database","sql","postgres","mongo","prisma"], icon: "🗄️", label: "Database" },
];

function detectTopics(title: string, content: string) {
  const text = (title + " " + content).toLowerCase();
  return TOPIC_MAP.filter(({ keywords }) => keywords.some((k) => text.includes(k))).slice(0, 4);
}

const FeaturedPost = ({ post }: FeaturedPostProps) => {
  const [gradient, blob] = getCover(post.id);
  const topics = detectTopics(post.title, post.content);

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-4">
        <Star size={15} className="text-amber-500 fill-amber-500" />
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
          Featured Story
        </span>
      </div>

      <Link
        to={`/post/${post.slug}`}
        className="group grid overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-md transition-all duration-300 hover:shadow-2xl hover:shadow-slate-300/50 hover:-translate-y-1 md:grid-cols-[1fr_1.1fr]"
      >
        {/* Rich gradient cover with dynamic topic pills */}
        <div
          className={`relative flex min-h-[220px] flex-col items-center justify-center gap-5 overflow-hidden bg-gradient-to-br ${gradient} px-8 md:min-h-[340px]`}
        >
          {/* Grid texture */}
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.9) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          {/* Blob */}
          <div className={`absolute -top-12 -right-12 h-48 w-48 rounded-full ${blob} blur-3xl`} />
          <div className={`absolute -bottom-12 -left-12 h-36 w-36 rounded-full ${blob} blur-3xl`} />

          {/* Topic pills — if detected, show them. Otherwise show initial letter */}
          {topics.length > 0 ? (
            <div className="relative flex flex-wrap justify-center gap-2.5">
              {topics.map(({ icon, label }) => (
                <span
                  key={label}
                  className="flex items-center gap-1.5 rounded-full bg-white/15 border border-white/25 backdrop-blur-sm px-4 py-1.5 text-sm font-bold text-white shadow-sm"
                >
                  <span>{icon}</span>
                  {label}
                </span>
              ))}
            </div>
          ) : (
            <span className="relative text-8xl font-black text-white/25 select-none">
              {post.title.charAt(0).toUpperCase()}
            </span>
          )}

          {/* "Featured" badge inside cover */}
          <span className="relative rounded-full bg-white/15 border border-white/25 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white/80 backdrop-blur-sm">
            Editor's Pick
          </span>
        </div>

        {/* Content panel */}
        <div className="flex flex-col justify-center p-7 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-tight transition-colors duration-200 group-hover:text-indigo-600">
            {post.title}
          </h2>

          <p className="mt-3 line-clamp-3 text-base leading-relaxed text-slate-500">
            {post.content}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <Avatar name={post.author.name} size="md" />
            <div>
              <p className="text-sm font-semibold text-slate-800 leading-none">
                {post.author.name}
              </p>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                <Calendar size={11} />
                {formatDate(post.createdAt)}
                <span>·</span>
                {readingTime(post.content)}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-sm text-slate-500">
                <Heart size={14} className="text-rose-400" />
                {post._count?.likes ?? 0}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-slate-500">
                <MessageCircle size={14} className="text-blue-400" />
                {post._count?.comments ?? 0}
              </span>
            </div>
            <span className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition-all duration-200 group-hover:bg-indigo-700 group-hover:shadow-md group-hover:shadow-indigo-200">
              Read now
              <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
};

export default FeaturedPost;
