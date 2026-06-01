import { LeadForm } from "@/components/LeadForm";
import { Phone, Shield, Star, Home } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-stone-200 px-6 py-4 bg-white">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png.png" alt="Company Logo" width={48} height={48} className="object-contain" />
            <div>
              <p className="font-bold text-stone-800 leading-tight">Pegasus Mortgage</p>
              <p className="text-xs text-stone-500 leading-tight">Lending Center Inc · Vaughan &amp; Toronto</p>
            </div>
          </div>
          <a
            href="tel:+16478674070"
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355] hover:text-white transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">Free Consultation</span>
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-16 grid lg:grid-cols-2 gap-16 items-start">
        {/* Left — hero copy */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#8B7355]/10 text-[#8B7355] text-sm px-3 py-1 rounded-full border border-[#8B7355]/30">
              <Star className="w-3.5 h-3.5" />
              Pegasus Mortgage Lending Center Inc
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-stone-900">
              Your mortgage,<br />
              <span className="text-[#8B7355]">done right.</span>
            </h1>
            <p className="text-stone-500 text-lg leading-relaxed">
              Whether you&apos;re buying your first home, renewing, or refinancing — I&apos;ll find
              you the best rate with a lender that fits your situation. Licensed in Ontario.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Shield, title: "FSRA Licensed", desc: "Regulated mortgage agent in Ontario" },
              { icon: Star, title: "Best Rates", desc: "Access to 50+ lenders and banks" },
              { icon: Phone, title: "Fast Response", desc: "Hear back within 24 hours" },
              { icon: Home, title: "All Property Types", desc: "Purchase, refinance, renewal, HELOC" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-3 p-4 rounded-xl bg-stone-50 border border-stone-200">
                <div className="w-8 h-8 rounded-lg bg-[#8B7355]/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[#8B7355]" />
                </div>
                <div>
                  <p className="text-stone-800 font-medium text-sm">{title}</p>
                  <p className="text-stone-400 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-stone-400 text-sm">
            Your information is private and will never be shared without your consent.
          </p>
        </div>

        {/* Right — lead form */}
        <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-stone-900">Get a free consultation</h2>
            <p className="text-stone-400 text-sm mt-1">No obligation. No credit check. Response within 24 hours.</p>
          </div>
          <LeadForm />
        </div>
      </div>
    </main>
  );
}
