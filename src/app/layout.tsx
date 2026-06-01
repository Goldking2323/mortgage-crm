import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "Mortgage CRM | Ontario Mortgage Agent",
  description: "Get a free mortgage consultation. Serving Vaughan, Toronto, and the GTA.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full">{children && <Providers>{children}</Providers>}</body>
    </html>
  );
}
