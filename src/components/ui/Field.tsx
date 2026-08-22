import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { clsx } from "@/lib/clsx";

const controlClasses =
  "w-full rounded-lg border border-ink-300 bg-white px-3 py-2.5 text-sm text-ink-900 shadow-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30";

export function Label({ children, htmlFor }: { children: ReactNode; htmlFor: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink-700">
      {children}
    </label>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={clsx(controlClasses, className)} {...props} />;
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={clsx(controlClasses, className)} {...props} />;
}

export function FieldGroup({ children }: { children: ReactNode }) {
  return <div className="mb-4">{children}</div>;
}

export function HelpText({ children }: { children: ReactNode }) {
  return <p className="mt-1.5 text-xs text-ink-500">{children}</p>;
}
