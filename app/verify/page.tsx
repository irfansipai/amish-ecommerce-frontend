"use client";
import React, { Suspense, useEffect, useState } from "react";
import { Loader2, Check, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";

function VerifyContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const verifyEmail = async () => {
      try {
        await api.get(`/api/v1/auth/verify-email?token=${token}`);
        setStatus("success");
      } catch {
        setStatus("error");
      }
    };

    verifyEmail();
  }, [token]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-900" />
        <p className="text-sm tracking-widest uppercase text-zinc-500">
          Verifying Secure Link...
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="w-12 h-12 bg-green-50 flex items-center justify-center rounded-full">
          <Check className="w-6 h-6 text-green-800" />
        </div>
        <h1 className="text-2xl font-light tracking-widest text-zinc-900 uppercase">
          Access Granted        </h1>
        <p className="text-zinc-600 max-w-sm text-sm">
          Your email has been successfully verified. You now have full access to your account.
        </p>
        <Link href="/checkout" className="mt-4 border-b border-black text-xs font-bold tracking-widest uppercase pb-1 hover:text-zinc-600 transition-colors">
          Proceed to Checkout
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="w-12 h-12 bg-red-50 flex items-center justify-center rounded-full">
        <X className="w-6 h-6 text-red-800" />
      </div>
      <h1 className="text-2xl font-light tracking-widest text-zinc-900 uppercase">
        Verification Failed
      </h1>
      <p className="text-zinc-600 max-w-sm text-sm">
        The link may be expired or invalid.
      </p>
      <Link href="/" className="mt-4 border-b border-black text-xs font-bold tracking-widest uppercase pb-1 hover:text-zinc-600 transition-colors">
        Return to Homepage
      </Link>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <React.Suspense fallback={<div className="flex flex-col items-center gap-4"><Loader2 className="w-8 h-8 animate-spin text-zinc-900" /><p className="text-sm tracking-widest uppercase text-zinc-500">Verifying Secure Link...</p></div>}>
        <VerifyContent />
      </React.Suspense>
    </div>
  );
}