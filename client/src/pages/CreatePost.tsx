import { useState } from "react";
import { createPost } from "../services/postService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import {
  PenSquare,
  Type,
  AlignLeft,
  Loader2,
  AlertCircle,
  Send,
} from "lucide-react";

const TITLE_MAX = 120;

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors([]);
    setLoading(true);

    if (!title.trim() || !content.trim()) {
      setLoading(false);
      return;
    }

    try {
      await createPost({ title, content });

      toast.success("Story published", { icon: "✓", style: { fontWeight: "600" } });

      navigate("/");
    } catch (err) {
      const error = err as AxiosError<{ errors?: { message: string }[] }>;
      const issues = error.response?.data?.errors;

      if (issues) {
        setErrors(issues.map((issue: { message: string }) => issue.message));
      } else {
        setErrors(["Something went wrong. Please try again."]);
      }

      toast.error("Failed to publish — please try again");
    } finally {
      setLoading(false);
    }
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-6 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <PenSquare size={20} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Write a new article
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Share your thoughts with the QuillPen community
            </p>
          </div>
        </div>

        {/* Validation errors */}
        {errors.length > 0 && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 animate-fade-in-up">
            <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
            <div className="text-sm text-red-700 space-y-1">
              {errors.map((err, index) => (
                <p key={index}>{err}</p>
              ))}
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm"
        >
          {/* Title field */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="title" className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                <Type size={14} />
                Title
              </label>
              <span
                className={`text-xs font-medium tabular-nums ${
                  title.length > TITLE_MAX ? "text-red-500" : "text-slate-400"
                }`}
              >
                {title.length}/{TITLE_MAX}
              </span>
            </div>
            <input
              id="title"
              type="text"
              placeholder="Enter a compelling title…"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={TITLE_MAX + 20}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-lg font-semibold text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 placeholder:font-normal focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
            />
          </div>

          {/* Content field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="content" className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                <AlignLeft size={14} />
                Content
              </label>
              <span className="text-xs font-medium text-slate-400 tabular-nums">
                {wordCount} {wordCount === 1 ? "word" : "words"}
              </span>
            </div>
            <textarea
              id="content"
              placeholder="Write your article here…"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={14}
              className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-[15px] leading-relaxed text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
            />
          </div>

          {/* Footer actions */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
            <p className="text-xs text-slate-400">
              Your article will be published immediately and visible to everyone.
            </p>
            <button
              type="submit"
              disabled={loading || !title.trim() || !content.trim()}
              className="flex shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-none"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Publishing…
                </>
              ) : (
                <>
                  <Send size={15} />
                  Publish post
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
