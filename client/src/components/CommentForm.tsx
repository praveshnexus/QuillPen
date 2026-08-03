import { useState } from "react";
import { createComment } from "../services/commentService";
import toast from "react-hot-toast";
import { Send, Loader2 } from "lucide-react";

interface CommentFormProps {
  postId: string;
  onCommentAdded: () => void;
}

const MAX_CHARS = 1000;

const CommentForm = ({ postId, onCommentAdded }: CommentFormProps) => {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;

    setLoading(true);
    try {
      await createComment(postId, { content: comment });
      setComment("");
      onCommentAdded();
      toast.success("Comment posted", { icon: "💬", style: { fontWeight: "600" } });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  const remaining = MAX_CHARS - comment.length;
  const isOverLimit = remaining < 0;
  const isNearLimit = remaining <= 100 && remaining >= 0;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <h3 className="text-base font-bold text-slate-900 mb-4">
        Join the discussion
      </h3>

      <div
        className={`relative rounded-xl border transition-all duration-200 ${
          isOverLimit
            ? "border-red-300 ring-2 ring-red-100"
            : "border-slate-200 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100"
        }`}
      >
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts on this article…"
          rows={4}
          className="w-full resize-none rounded-xl bg-transparent px-4 pt-4 pb-3 text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 outline-none"
          aria-label="Write a comment"
          maxLength={MAX_CHARS + 50}
        />

        {/* Bottom bar inside textarea box */}
        <div className="flex items-center justify-between px-4 pb-3">
          <p className="text-xs text-slate-400">
            Be respectful and on-topic.
          </p>
          <span
            className={`text-xs font-medium tabular-nums ${
              isOverLimit
                ? "text-red-500"
                : isNearLimit
                ? "text-amber-500"
                : "text-slate-400"
            }`}
          >
            {remaining < 0 ? `-${Math.abs(remaining)}` : remaining}
          </span>
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <button
          disabled={loading || !comment.trim() || isOverLimit}
          onClick={handleCommentSubmit}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Posting…
            </>
          ) : (
            <>
              <Send size={14} />
              Post comment
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CommentForm;
