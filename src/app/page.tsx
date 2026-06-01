import { LeadForm } from "@/components/LeadForm";
import { Home, Phone, Shield, Star } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold text-lg">Ontario Mortgage</span>
          </div>
          <a
            href="tel:+14165551234"
            className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors text-sm"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">Call for a free consultation</span>
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-16 grid lg:grid-cols-2 gap-16 items-start">
        {/* Left — hero copy */}
        <div className="text-white space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 text-sm px-3 py-1 rounded-full border border-blue-500/30">
              <Star className="w-3.5 h-3.5" />
              Serving Vaughan, Toronto &amp; the GTA
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              Your mortgage,<br />
              <span className="text-blue-400">done right.</span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
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
              <div key={title} className="flex gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{title}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-slate-500 text-sm">
            Your information is private and will never be shared without your consent.
          </p>
        </div>

        {/* Right — lead form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Get a free consultation</h2>
            <p className="text-slate-500 text-sm mt-1">Fill out the form below — no obligation, no credit check.</p>
          </div>
          <LeadForm />
        </div>
      </div>
    </main>
  );
}
