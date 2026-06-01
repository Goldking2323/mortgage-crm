import { CheckCircle, Home } from "lucide-react";
import Link from "next/link";

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-3">You&apos;re all set!</h1>
        <p className="text-slate-600 mb-6">
          Thank you for reaching out. I&apos;ll review your information and be in touch within 24 hours to discuss your
          mortgage options.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          <Home className="w-4 h-4" />
          Back to home
        </Link>
      </div>
    </main>
  );
}
