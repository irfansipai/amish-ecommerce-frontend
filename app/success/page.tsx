// app/success/page.tsx
"use client"

import { Suspense } from "react"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { useSearchParams } from "next/navigation"

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id")
  
  // Format the ID to look clean (e.g., #43FCD093) just like your receipt page
  const displayId = orderId ? `#${orderId.slice(0, 8).toUpperCase()}` : "recently placed"

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <CheckCircle className="w-16 h-16 text-green-800 mb-6" strokeWidth={1} />
      <h1 className="text-3xl font-light tracking-widest text-zinc-900 uppercase mb-4 text-center">
        Order Confirmed
      </h1>
      <p className="text-zinc-600 mb-8 text-center max-w-md leading-relaxed">
        Thank you for your purchase. Your order <span className="font-bold text-zinc-900">{displayId}</span> has been received. An email receipt is on its way.
      </p>
      <Link 
        href="/catalog" 
        className="bg-black text-white px-8 py-4 text-sm font-medium tracking-widest uppercase hover:bg-zinc-800 transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-xs tracking-[0.2em] uppercase text-zinc-500">Confirming Order...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}