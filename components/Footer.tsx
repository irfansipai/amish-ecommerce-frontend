// frontend/components/Footer.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <footer className="bg-black text-white">
      {/* Main Footer Content */}
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1: Client Services */}
          <div>
            <h3 className="text-xs tracking-[0.2em] text-slate-400 mb-8">
              MAY WE HELP YOU?
            </h3>
            <ul className="space-y-4">
              {[
                "Contact Us",
                // , "FAQs", "Email Unsubscribe", "Sitemap"
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="/contact"
                    className="text-sm text-white hover:text-slate-300 underline underline-offset-4 decoration-white/30 hover:decoration-white/60 transition-all"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: The Company */}
          <div>
            <h3 className="text-xs tracking-[0.2em] text-slate-400 mb-8">
              THE COMPANY
            </h3>
            <ul className="space-y-4">
              {[
                // "About Maison",
                // "Maison Equilibrium",
                // "Code of Ethics",
                // "Careers",
                // "Legal",
                "Privacy Policy",
                "Cookie Policy",
                // "Cookie Settings",
                // "Corporate Information",
                // "Vulnerability Disclosure Policy"
              ].map((item) => (
                <li key={item}>
                  <Link
                    href={item.toLowerCase().replaceAll(" ", "-")}
                    className="text-sm text-white hover:text-slate-300 underline underline-offset-4 decoration-white/30 hover:decoration-white/60 transition-all"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Store Locator & Newsletter */}
          <div className="lg:col-span-2">
            {/* Store Locator */}
            {/* <h3 className="text-xs tracking-[0.2em] text-slate-400 mb-6">
              STORE LOCATOR
            </h3>
            <button className="w-full flex items-center justify-between py-4 border-b border-white/20 text-left hover:border-white/40 transition-colors group">
              <span className="text-white/70 text-sm">Country/Region, City</span>
              <ChevronRight className="size-5 text-white/50 group-hover:text-white transition-colors" />
            </button> */}

            {/* Newsletter Signup */}
            {/* <h3 className="text-xs tracking-[0.2em] text-slate-400 mt-12 mb-4">
              SIGN UP FOR MAISON UPDATES
            </h3>
            <p className="text-xs text-white/60 mb-6 leading-relaxed">
              By entering your email address below, you consent to receiving our newsletter with access to our latest collections, events and initiatives. More details on this are provided in our{" "}
              <Link href="#" className="underline hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </p>
            <form onSubmit={handleNewsletterSubmit} className="relative">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-0 border-b border-white/20 rounded-none px-0 py-4 text-white placeholder:text-white/50 focus-visible:ring-0 focus-visible:border-white"
                required
              />
              <button 
                type="submit" 
                className="absolute right-0 top-1/2 -translate-y-1/2 text-white hover:opacity-70 transition-opacity"
                aria-label="Subscribe"
              >
                <ArrowRight className="size-5" />
              </button>
            </form>  */}

            {/* Language & Region */}
            {/* <div className="grid grid-cols-2 gap-8 mt-12">
              <div>
                <h3 className="text-xs tracking-[0.2em] text-slate-400 mb-4">
                  LANGUAGE
                </h3>
                <button className="flex items-center gap-2 text-sm text-white underline underline-offset-4 hover:opacity-70 transition-opacity">
                  English
                  <ChevronRight className="size-4 rotate-90" />
                </button>
              </div>
              <div>
                <h3 className="text-xs tracking-[0.2em] text-slate-400 mb-4">
                  COUNTRY/REGION
                </h3>
                <Link href="#" className="text-sm text-white underline underline-offset-4 hover:opacity-70 transition-opacity">
                  International Site
                </Link>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10 px-6 lg:px-12 py-8">
        <div className="max-w-[1800px] mx-auto">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()}{" "}
            {process.env.NEXT_PUBLIC_COMPANY_NAME || "Maison"} S.p.A. - All
            rights reserved.
          </p>
        </div>
      </div>

      {/* Large Brand Logo */}
      <div className="overflow-hidden pb-8">
        <h2 className="font-serif text-[20vw] font-light tracking-[0.1em] text-white text-center whitespace-nowrap select-none">
          {process.env.NEXT_PUBLIC_COMPANY_NAME || "Maison"}
        </h2>
      </div>
    </footer>
  );
}
