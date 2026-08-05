import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, PenSquare, LogOut, Feather } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Avatar } from "./ui";

const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      toast.success("See you soon!", { icon: "👋" });
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) =>
    `relative text-sm font-medium transition-colors duration-200 ${
      isActive(path) ? "text-indigo-600" : "text-slate-600 hover:text-slate-900"
    }`;

  return (
    <nav
      className="sticky top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur-xl shadow-sm shadow-slate-200/50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group"
          aria-label="QuillPen home"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-300 group-hover:bg-indigo-700 transition-colors duration-200">
            <Feather size={18} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors duration-200">
            QuillPen
          </span>
        </Link>

        {/* Center nav links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={navLinkClass("/")}>
            Home
            {isActive("/") && (
              <span className="absolute -bottom-[18px] left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />
            )}
          </Link>

          {user && (
            <Link to="/bookmarks" className={navLinkClass("/bookmarks")}>
              <span className="flex items-center gap-1.5">
                <BookOpen size={15} />
                Reading List
              </span>
              {isActive("/bookmarks") && (
                <span className="absolute -bottom-[18px] left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />
              )}
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/bookmarks"
                className="md:hidden flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-indigo-600"
                aria-label="Reading List"
              >
                <BookOpen size={20} />
              </Link>
              <Link
                to="/create-post"
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 sm:px-4"
              >
                <PenSquare size={15} strokeWidth={2.5} />
                <span className="hidden sm:inline">Write</span>
              </Link>

              <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
                <Avatar name={user.name} size="sm" />
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-slate-800 leading-none">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">Author</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Log out"
                className="flex items-center gap-1.5 rounded-lg p-2 text-sm font-medium text-slate-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                aria-label="Log out"
              >
                <LogOut size={15} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200 rounded-lg hover:bg-slate-100"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl transition-all duration-200 hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
