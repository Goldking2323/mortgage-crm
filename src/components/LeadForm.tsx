"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

const labelClass = "block text-sm font-medium text-slate-700 mb-1";

const selectClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white";

export function LeadForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/thank-you");
    } else {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>First Name *</label>
          <input name="firstName" required placeholder="John" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Last Name *</label>
          <input name="lastName" required placeholder="Smith" className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Email *</label>
        <input name="email" type="email" required placeholder="john@example.com" className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Phone Number *</label>
        <input name="phone" type="tel" required placeholder="(416) 555-0100" className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>What are you looking for? *</label>
        <select name="propertyType" required className={selectClass}>
          <option value="">Select one...</option>
          <option value="PURCHASE">Purchasing a home</option>
          <option value="REFINANCE">Refinancing</option>
          <option value="RENEWAL">Mortgage renewal</option>
          <option value="HELOC">Home Equity Line (HELOC)</option>
          <option value="CONSTRUCTION">Construction / new build</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Purchase Price</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
            <input name="purchasePrice" type="number" placeholder="650,000" className={`${inputClass} pl-6`} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Down Payment</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
            <input name="downPayment" type="number" placeholder="130,000" className={`${inputClass} pl-6`} />
          </div>
        </div>
      </div>

      <div>
        <label className={labelClass}>Credit Score Range</label>
        <select name="creditRange" className={selectClass}>
          <option value="UNKNOWN">Not sure</option>
          <option value="EXCELLENT">Excellent (760+)</option>
          <option value="GOOD">Good (700–759)</option>
          <option value="FAIR">Fair (620–699)</option>
          <option value="POOR">Below 620</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Employment Status</label>
        <select name="employment" className={selectClass}>
          <option value="">Prefer not to say</option>
          <option value="employed">Employed (full-time / part-time)</option>
          <option value="self-employed">Self-employed</option>
          <option value="retired">Retired</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Were you referred by someone?</label>
        <input name="referredBy" placeholder="Referral name (optional)" className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Message (optional)</label>
        <textarea name="message" rows={3} placeholder="Anything else you'd like me to know..." className={`${inputClass} resize-none`} />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#8B7355] hover:bg-[#7a6348] text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Submitting..." : "Request Free Consultation →"}
      </button>

      <p className="text-center text-xs text-slate-400">
        No credit check. No obligation. Response within 24 hours.
      </p>
    </form>
  );
}
