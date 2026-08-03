import { useEffect, useState } from "react";
import {
  bookmarkPost,
  getBookmarkStatus,
  removeBookmark,
} from "../services/bookmarkService";
import { Bookmark } from "lucide-react";

interface BookmarkButtonProps {
  postId: string;
}

const BookmarkButton = ({ postId }: BookmarkButtonProps) => {
  const [bookmarked, setBookmarked] = useState(false);

  const fetchBookmarkStatus = async () => {
    try {
      const data = await getBookmarkStatus(postId);
      setBookmarked(data.bookmarked);
    } catch (error) {
      console.error("Error fetching bookmark status:", error);
    }
  };

  useEffect(() => {
    fetchBookmarkStatus();
  }, [postId]);

  const handleBookmark = async () => {
    try {
      if (bookmarked) {
        await removeBookmark(postId);
      } else {
        await bookmarkPost(postId);
      }
      await fetchBookmarkStatus();
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  return (
    <button
      onClick={handleBookmark}
      aria-label={bookmarked ? "Remove bookmark" : "Bookmark this post"}
      aria-pressed={bookmarked}
      className={`group flex items-center gap-2.5 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
        bookmarked
          ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
          : "border-slate-200 bg-white text-slate-600 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700"
      }`}
    >
      <Bookmark
        size={17}
        className={`transition-all duration-200 ${
          bookmarked
            ? "fill-amber-500 text-amber-500"
            : "text-slate-400 group-hover:text-amber-500"
        }`}
      />
      <span>{bookmarked ? "Saved" : "Save"}</span>
    </button>
  );
};

export default BookmarkButton;
