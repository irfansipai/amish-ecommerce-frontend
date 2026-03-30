// frontend/app/auth/page.tsx
"use client";

import { useState } from "react";
import { Mail, Apple, ChevronRight } from "lucide-react";

export default function AuthPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // We will connect this to FastAPI later
    console.log("Submitting email:", email);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="w-full max-w-md text-center mb-10">
        <h1 className="text-3xl font-light tracking-widest text-zinc-900 uppercase">
          My Account
        </h1>
      </div>

      {/* Main Auth Container */}
      <div className="w-full max-w-md space-y-6">
        {/* SSO Buttons */}
        <div className="space-y-3">
          <button className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-zinc-300 text-sm font-medium text-zinc-900 hover:bg-zinc-50 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            CONTINUE WITH GOOGLE
          </button>
          
          <button className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-zinc-300 text-sm font-medium text-zinc-900 hover:bg-zinc-50 transition-colors">
            <Apple className="w-5 h-5" />
            CONTINUE WITH APPLE
          </button>
        </div>

        {/* Divider */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest">
            <span className="bg-white px-4 text-zinc-500 font-medium">OR</span>
          </div>
        </div>

        {/* Email Form */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-normal tracking-wide text-zinc-900 mb-2">
            CONTINUE WITH YOUR EMAIL ADDRESS
          </h2>
          <p className="text-sm text-zinc-600">
            Sign in with your email and password or create a profile if you are new.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email*"
              required
              className="w-full px-4 py-3 border border-zinc-300 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-zinc-600 text-white py-4 text-sm font-medium tracking-widest uppercase hover:bg-zinc-800 transition-colors"
          >
            Continue
          </button>
        </form>
      </div>

      {/* Value Proposition Footer */}
      <div className="w-full max-w-4xl mt-24 pt-12 border-t border-zinc-200">
        <h3 className="text-center text-lg tracking-widest uppercase mb-12">
          Join Our Club
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wide uppercase">Track Your Orders</h4>
            <p className="text-sm text-zinc-600">Follow your orders every step of the way.</p>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wide uppercase">Streamline Checkout</h4>
            <p className="text-sm text-zinc-600">Check out faster with saved addresses and payment methods.</p>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wide uppercase">Exclusive Access</h4>
            <p className="text-sm text-zinc-600">Enjoy priority access to new collections and limited releases.</p>
          </div>
        </div>
      </div>
    </div>
  );
}