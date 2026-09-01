import React from "react";

export function FormField({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
    </div>
  );
}

export function Input({
  className = "",
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      className={`w-full rounded-xl border bg-white px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all ${
        error
          ? "border-red-400 focus:border-red-500 focus:ring-red-500"
          : "border-slate-300 focus:border-bste-navy-700 focus:ring-bste-navy-700"
      } ${className}`}
      {...props}
    />
  );
}

export function Select({
  className = "",
  children,
  error,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }) {
  return (
    <select
      className={`w-full rounded-xl border bg-white px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 transition-all ${
        error
          ? "border-red-400 focus:border-red-500 focus:ring-red-500"
          : "border-slate-300 focus:border-bste-navy-700 focus:ring-bste-navy-700"
      } ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
