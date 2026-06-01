import { CheckCircle, Home, Phone } from "lucide-react";
import Link from "next/link";

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-[#8B7355]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-[#8B7355]" />
        </div>
        <h1 className="text-2xl font-bold text-stone-900 mb-3">You&apos;re all set!</h1>
        <p className="text-stone-500 mb-2">
          Thank you for reaching out to <strong>Pegasus Mortgage Lending Center Inc</strong>.
        </p>
        <p className="text-stone-500 mb-6">
          I&apos;ll review your information and be in touch within 24 hours to discuss your mortgage options.
        </p>
        <a
          href="tel:+16478674070"
          className="inline-flex items-center gap-2 bg-[#8B7355] text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-[#7a6348] transition mb-4"
        >
          <Phone className="w-4 h-4" />
          Call (647) 867-4070
        </a>
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-600 text-sm mt-2">
            <Home className="w-4 h-4" />
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
