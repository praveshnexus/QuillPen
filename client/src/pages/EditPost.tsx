import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, updatePost } from "../services/postService";
import toast from "react-hot-toast";
import { Pencil, Type, AlignLeft, Loader2, Save } from "lucide-react";
import { Skeleton } from "../components/ui";

const TITLE_MAX = 120;

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!id) return;

        const data = await getPostById(id);

        setTitle(data.title);
        setContent(data.content);
      } catch (error) {
        console.error(error);
        toast.error("Could not save changes");
      } finally {
        setFetching(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    if (!title.trim() || !content.trim()) return;

    setLoading(true);

    try {
      await updatePost(id, {
        title,
        content,
      });

      toast.success("Changes saved", { icon: "✓", style: { fontWeight: "600" } });
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Could not save changes");
    } finally {
      setLoading(false);
    }
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-6 py-12 space-y-6">
          <Skeleton className="h-9 w-64" />
          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm space-y-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-6 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Pencil size={20} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Edit article
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Update your published article
            </p>
          </div>
        </div>

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
              placeholder="Enter post title…"
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
              Changes will be visible immediately after saving.
            </p>
            <button
              type="submit"
              disabled={loading || !title.trim() || !content.trim()}
              className="flex shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-none"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Updating…
                </>
              ) : (
                <>
                  <Save size={15} />
                  Save changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
