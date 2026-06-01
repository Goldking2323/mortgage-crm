import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | null | undefined): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(value);
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "short", day: "numeric" }).format(new Date(date));
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  return phone;
}

export const PIPELINE_STAGES = [
  { key: "NEW", label: "New Lead", color: "bg-slate-100 text-slate-700 border-slate-200" },
  { key: "CONTACTED", label: "Contacted", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { key: "PRE_QUALIFIED", label: "Pre-Qualified", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { key: "APPLIED", label: "Applied", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { key: "APPROVED", label: "Approved", color: "bg-green-100 text-green-700 border-green-200" },
  { key: "FUNDED", label: "Funded", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { key: "LOST", label: "Lost", color: "bg-red-100 text-red-700 border-red-200" },
] as const;

export type StageKey = (typeof PIPELINE_STAGES)[number]["key"];
