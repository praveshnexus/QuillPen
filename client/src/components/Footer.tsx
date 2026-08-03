import { Link } from "react-router-dom";
import { Feather } from "lucide-react";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 group mb-4"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm group-hover:bg-indigo-700 transition-colors">
                <Feather size={17} strokeWidth={2.5} />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                QuillPen
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500 max-w-xs">
              A modern writing platform for developers, designers, and creators
              who care about quality writing.
            </p>
            {/* Social links */}
            <div className="mt-5 flex items-center gap-3">
              {[
                {
                  href: "https://github.com",
                  icon: <FaGithub size={17} />,
                  label: "GitHub",
                },
                {
                  href: "https://linkedin.com",
                  icon: <FaLinkedin size={17} />,
                  label: "LinkedIn",
                },
                {
                  href: "https://twitter.com",
                  icon: <FaXTwitter size={17} />,
                  label: "Twitter (X)",
                },
              ].map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
              Explore
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Home", to: "/" },
                { label: "Reading List", to: "/bookmarks" },
                { label: "Write Story", to: "/create-post" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm text-slate-600 hover:text-indigo-600 transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
              Account
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Sign up", to: "/signup" },
                { label: "Log in", to: "/login" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm text-slate-600 hover:text-indigo-600 transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 sm:flex-row">
          <p className="text-sm text-slate-400">
            © {year} QuillPen. All rights reserved.
          </p>
          <p className="text-sm text-slate-400">
            Built with <span className="text-rose-400">♥</span> using React +
            TypeScript + Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
