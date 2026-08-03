import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { PenSquare, ArrowRight, Sparkles } from "lucide-react";

const Hero = () => {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-8 py-10 sm:py-14 text-white mb-10">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-violet-600/15 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 h-40 w-40 rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3.5 py-1 text-xs font-medium text-indigo-300 backdrop-blur-sm mb-4">
          <Sparkles size={12} className="text-indigo-400" />
          Modern Blogging Platform
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.08]">
          Discover stories{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
            worth reading.
          </span>
        </h1>

        <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-slate-300/90">
          Thoughtful writing from developers, designers, and creators.
          Learn something new every day — or share your own perspective.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {user ? (
            <Link
              to="/create-post"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-indigo-700 transition-all duration-200 hover:shadow-lg hover:shadow-white/20 hover:-translate-y-0.5 active:translate-y-0"
            >
              <PenSquare size={15} />
              Start Writing
            </Link>
          ) : (
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-indigo-700 transition-all duration-200 hover:shadow-lg hover:shadow-white/20 hover:-translate-y-0.5 active:translate-y-0"
            >
              Get started free
              <ArrowRight size={15} />
            </Link>
          )}
          <a
            href="#articles"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/8 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/15 hover:border-white/25"
          >
            Browse articles
          </a>
        </div>

        <div className="mt-8 flex justify-center gap-10 sm:gap-14">
          {[
            { value: "100+", label: "Articles published" },
            { value: "50+", label: "Active writers" },
            { value: "500+", label: "Monthly readers" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-xl font-black text-white">{value}</p>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-widest text-slate-400">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
