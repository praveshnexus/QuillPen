import { useState } from "react";
import { signupUser } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock, User, Eye, EyeOff, Loader2, Feather } from "lucide-react";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setLoading(false);
      return;
    }

    try {
      await signupUser({
        name,
        email,
        password,
      });

      toast.success("Account created!", { icon: "🎉", style: { fontWeight: "600" } });
      navigate("/login");
    } catch {
      toast.error("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-slate-50 flex flex-col">
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
              <Feather size={22} strokeWidth={2.5} />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 shadow-xl shadow-slate-200/50">
            <h1 className="text-center text-3xl font-black tracking-tight text-slate-900">
              Create your account
            </h1>
            <p className="mt-2 text-center text-slate-500">
              Join QuillPen and start writing today
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Name
                </label>
                <div className="relative">
                  <User
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-11 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !name.trim() || !email.trim() || !password.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-none"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "Creating account…" : "Create account"}
              </button>
            </form>
          </div>

          <p className="mt-7 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline underline-offset-2"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
