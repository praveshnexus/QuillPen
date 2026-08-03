// ─── Reusable UI Primitives ────────────────────────────────────────────────
// Button, Badge, Avatar, Card, LoadingSkeleton, EmptyState, SectionHeader
// All purely presentational — zero business logic, zero API calls.

import { type ReactNode, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

// ─── Button ────────────────────────────────────────────────────────────────

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-sm shadow-indigo-200 hover:shadow-md hover:shadow-indigo-200",
  secondary:
    "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  danger:
    "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300",
  outline:
    "border border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3.5 py-1.5 text-sm gap-1.5 rounded-lg",
  md: "px-5 py-2.5 text-sm gap-2 rounded-xl",
  lg: "px-7 py-3.5 text-base gap-2.5 rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconPosition = "left",
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-semibold
        transition-all duration-200 select-none cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin shrink-0" />
      ) : (
        icon && iconPosition === "left" && (
          <span className="shrink-0">{icon}</span>
        )
      )}
      {children}
      {!loading && icon && iconPosition === "right" && (
        <span className="shrink-0">{icon}</span>
      )}
    </button>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────

type BadgeVariant = "blue" | "purple" | "green" | "amber" | "slate";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const badgeVariants: Record<BadgeVariant, string> = {
  blue: "bg-blue-50 text-blue-700 ring-1 ring-blue-100",
  purple: "bg-purple-50 text-purple-700 ring-1 ring-purple-100",
  green: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
  amber: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
  slate: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
};

export function Badge({ children, variant = "blue", className = "" }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide
        ${badgeVariants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

// ─── Avatar ────────────────────────────────────────────────────────────────

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const avatarSizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-xl",
};

// Deterministic color from name
const avatarColors = [
  "bg-violet-100 text-violet-700",
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-indigo-100 text-indigo-700",
  "bg-teal-100 text-teal-700",
  "bg-pink-100 text-pink-700",
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

export function Avatar({ name, size = "md", className = "" }: AvatarProps) {
  const color = getAvatarColor(name);
  return (
    <div
      className={`
        flex items-center justify-center rounded-full font-bold shrink-0
        ${avatarSizes[size]}
        ${color}
        ${className}
      `}
      aria-label={name}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({
  children,
  className = "",
  hover = false,
  padding = "md",
}: CardProps) {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };
  return (
    <div
      className={`
        bg-white rounded-2xl border border-slate-200/80 shadow-sm
        ${hover ? "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-indigo-200/60" : ""}
        ${paddingClasses[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// ─── LoadingSkeleton ────────────────────────────────────────────────────────

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className = "", style }: SkeletonProps) {
  return (
    <div
      className={`bg-slate-200 rounded-lg skeleton-pulse ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

export function PostCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col gap-4">
      <Skeleton className="h-4 w-16 rounded-full" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-4/5" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex items-center gap-3 pt-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

export function SinglePostSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col gap-6">
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-10 w-1/2" />
      <div className="flex items-center gap-4 py-4 border-y border-slate-100">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" style={{ width: `${80 + Math.random() * 20}%` }} />
      ))}
    </div>
  );
}

// ─── EmptyState ─────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center animate-fade-in-up">
      {icon && (
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-50 to-violet-100 text-indigo-400 mb-6 ring-1 ring-indigo-100">
          {icon}
        </div>
      )}
      <h3 className="text-2xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-sm mb-8 leading-relaxed">{description}</p>
      {action}
    </div>
  );
}

// ─── SectionHeader ──────────────────────────────────────────────────────────

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`mb-10 ${className}`}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-indigo-600 mb-4">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-slate-500 text-lg max-w-xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
