import { useState } from "react";
import type { Comment } from "../types/comment";
import { deleteComment } from "../services/commentService";
import { Trash2, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { Avatar } from "./ui";

interface CommentCardProps {
  comment: Comment;
  postId: string;
  currentUserId?: string;
  onDelete: () => void;
}

function formatTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const CommentCard = ({
  comment,
  postId,
  currentUserId,
  onDelete,
}: CommentCardProps) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteComment = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    try {
      setDeleting(true);
      await deleteComment(postId, comment.id);
      onDelete();
      toast.success("Comment removed", { icon: "🗑️" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const isOwner = currentUserId === comment.user.id;

  return (
    <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:border-slate-300/60 hover:shadow-md animate-fade-in-up">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <Avatar name={comment.user.name} size="md" className="shrink-0 mt-0.5" />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-sm font-bold text-slate-900 truncate">
                {comment.user.name}
              </span>
              <span className="text-xs text-slate-400 shrink-0">
                {formatTimeAgo(comment.createdAt)}
              </span>
            </div>

            {/* Delete controls */}
            {isOwner && (
              <div className="flex items-center gap-2 shrink-0">
                {confirmDelete ? (
                  <>
                    <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                      <AlertTriangle size={12} />
                      Sure?
                    </span>
                    <button
                      onClick={handleDeleteComment}
                      disabled={deleting}
                      className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                    >
                      {deleting ? "Deleting…" : "Yes, delete"}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleDeleteComment}
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-400 opacity-0 group-hover:opacity-100 transition-all duration-150 hover:bg-red-50 hover:text-red-500"
                    aria-label="Delete comment"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>

          <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
            {comment.content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
