import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

const SearchBar = ({ value, onChange, onSearch }: SearchBarProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSearch();
    if (e.key === "Escape" && value) {
      onChange("");
      onSearch();
    }
  };

  const handleClear = () => {
    onChange("");
    onSearch();
  };

  return (
    <div className="relative mx-auto" style={{ maxWidth: "700px" }}>
      <div className="group relative flex items-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 transition-all duration-200 focus-within:border-indigo-300 focus-within:shadow-xl focus-within:shadow-indigo-100/60 hover:border-slate-300 hover:shadow-xl">
        {/* Search icon */}
        <div className="flex shrink-0 items-center pl-5 text-slate-400 transition-colors group-focus-within:text-indigo-500">
          <Search size={19} strokeWidth={2} />
        </div>

        {/* Input */}
        <input
          type="text"
          value={value}
          placeholder="Search articles by title or topic…"
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent px-4 py-4 text-base text-slate-900 placeholder:text-slate-400 outline-none"
          aria-label="Search articles"
        />

        {/* Clear button */}
        {value && (
          <button
            onClick={handleClear}
            className="shrink-0 mr-2 flex items-center justify-center h-7 w-7 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all duration-150"
            aria-label="Clear search"
          >
            <X size={15} />
          </button>
        )}

        {/* Search button */}
        <button
          onClick={onSearch}
          className="shrink-0 m-1.5 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-700 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          Search
        </button>
      </div>

      {/* Hint text */}
      <p className="mt-2.5 text-center text-xs text-slate-400">
        Press <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[11px] text-slate-500">Enter</kbd> to search
      </p>
    </div>
  );
};

export default SearchBar;
