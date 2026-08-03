import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import {
  getLikeCount,
  getLikeStatus,
  likePost,
  unlikePost,
} from "../services/likeServices";

interface LikeButtonProps {
  postId: string;
}

const LikeButton = ({ postId }: LikeButtonProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [animating, setAnimating] = useState(false);

  const fetchLikeStatus = async () => {
    try {
      const data = await getLikeStatus(postId);
      setLiked(data.liked);
    } catch (error) {
      console.error("Error fetching like status:", error);
    }
  };

  const fetchLikeCount = async () => {
    try {
      const data = await getLikeCount(postId);
      setLikeCount(data.likes);
    } catch (error) {
      console.error("Error fetching like count:", error);
    }
  };

  useEffect(() => {
    fetchLikeStatus();
    fetchLikeCount();
  }, [postId]);

  const handleLike = async () => {
    try {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 400);

      if (liked) {
        await unlikePost(postId);
        setLiked(false);
        setLikeCount((prev) => prev - 1);
      } else {
        await likePost(postId);
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <button
      onClick={handleLike}
      aria-label={liked ? "Unlike this post" : "Like this post"}
      aria-pressed={liked}
      className={`group flex items-center gap-2.5 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 ${
        liked
          ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
          : "border-slate-200 bg-white text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
      }`}
    >
      <Heart
        size={17}
        className={`transition-all duration-200 ${
          animating ? "scale-150" : "scale-100"
        } ${
          liked
            ? "fill-rose-500 text-rose-500"
            : "text-slate-400 group-hover:text-rose-400"
        }`}
      />
      <span className="tabular-nums">{likeCount}</span>
      <span>{liked ? "Liked" : "Like"}</span>
    </button>
  );
};

export default LikeButton;
