// frontend/app/verify/page.tsx
"use client";
import { useEffect, useState } from "react";
import { Loader2, Check } from "lucide-react";
import Link from "next/link";

export default function VerifyPage() {
  const [status, setStatus] = useState<"loading" | "success">("loading");

  useEffect(() => {
    // Simulate API call to FastAPI to verify the token
    const timer = setTimeout(() => setStatus("success"), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      {status === "loading" ? (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-900" />
          <p className="text-sm tracking-widest uppercase text-zinc-500">Verifying Secure Link...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="w-12 h-12 bg-green-50 flex items-center justify-center rounded-full">
            <Check className="w-6 h-6 text-green-800" />
          </div>
          <h1 className="text-2xl font-light tracking-widest text-zinc-900 uppercase">Access Granted</h1>
          <p className="text-zinc-600 max-w-sm text-sm">Your email has been successfully verified. You now have full access to your account.</p>
          <Link href="/checkout" className="mt-4 border-b border-black text-xs font-bold tracking-widest uppercase pb-1 hover:text-zinc-600 transition-colors">
            Proceed to Checkout
          </Link>
        </div>
      )}
    </div>
  );
}