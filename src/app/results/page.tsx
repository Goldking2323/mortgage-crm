"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Phone, Home, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface RateEstimate {
  available: boolean;
  rate?: number;
  termLabel?: string;
  insuredStatus?: "Insured" | "Conventional";
  message?: string;
}

interface MortgageQuote {
  firstName: string;
  propertyType: string;
  estimate: RateEstimate;
}

export default function ResultsPage() {
  const router = useRouter();
  const [quote, setQuote] = useState<MortgageQuote | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("mortgageQuote");
    if (!raw) {
      router.replace("/");
      return;
    }
    setQuote(JSON.parse(raw));
    setChecked(true);
  }, [router]);

  if (!checked || !quote) return null;

  const { firstName, estimate } = quote;

  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <div className="flex flex-col items-center gap-3 mb-8">
          <Image src="/logo.png.png" alt="Logo" width={56} height={56} className="object-contain" />
          <div className="text-center">
            <p className="text-stone-800 font-bold text-xl">Pegasus Mortgage</p>
            <p className="text-stone-400 text-sm">Lending Center Inc</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-8 text-center">
          <div className="w-14 h-14 bg-[#8B7355]/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-7 h-7 text-[#8B7355]" />
          </div>

          <h1 className="text-2xl font-bold text-stone-900 mb-2">
            Thanks, {firstName}!
          </h1>
          <p className="text-stone-500 text-sm mb-6">
            Here&apos;s your free rate estimate, and what happens next.
          </p>

          {estimate.available ? (
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 mb-6">
              <p className="text-xs uppercase tracking-wide text-stone-400 mb-1">
                Estimated Hub Rate{estimate.termLabel ? ` · ${estimate.termLabel}` : ""}
                {estimate.insuredStatus ? ` · ${estimate.insuredStatus}` : ""}
              </p>
              <p className="text-5xl font-bold text-[#8B7355] mb-1">
                {estimate.rate?.toFixed(2)}%
              </p>
              <p className="text-stone-400 text-xs">as low as, based on what you shared</p>
            </div>
          ) : (
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 mb-6">
              <p className="text-stone-600 text-sm">
                {estimate.message || "I'll prepare a personalized rate quote for you."}
              </p>
            </div>
          )}

          <div className="flex gap-3 text-left bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">
              This is an <strong>approximation only</strong>, based on current Hub rates and the
              information you provided. Your actual rate depends on full underwriting, and
              specialty or alternative-lender rates may apply to your situation. This is not a
              rate guarantee or pre-approval.
            </p>
          </div>

          <div className="text-left bg-[#8B7355]/5 border border-[#8B7355]/20 rounded-xl p-4 mb-6">
            <p className="text-sm text-stone-700 leading-relaxed">
              You&apos;ve also submitted your contact info above — I&apos;ll personally review your
              details and reach out within 24 hours to confirm your real, personalized rate and
              walk you through your options.
            </p>
          </div>

          <a
            href="tel:+16478674070"
            className="inline-flex items-center justify-center gap-2 bg-[#8B7355] text-white px-5 py-3 rounded-lg font-medium text-sm hover:bg-[#7a6348] transition w-full mb-4"
          >
            <Phone className="w-4 h-4" />
            Call (647) 867-4070 Now
          </a>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-600 text-sm"
          >
            <Home className="w-4 h-4" />
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
