// app/reset-password/page.tsx
"use client"

import { Suspense, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-sm text-red-600 tracking-widest uppercase">Invalid or missing reset token.</p>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.")
      return
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.")
      return
    }

    setIsSubmitting(true)
    try {
      await api.post("/api/v1/auth/reset-password", {
        token: token,
        new_password: password
      })
      
      toast.success("Password reset successfully! You can now log in.")
      router.push("/auth") // Send them back to login
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to reset password.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md bg-white p-8 border border-zinc-200">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-light tracking-[0.2em] uppercase text-zinc-900 mb-2">
            Reset Password
          </h1>
          <p className="text-sm text-zinc-500">
            Please enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-[10px] font-bold tracking-[0.15em] text-zinc-500 uppercase mb-2 block">
              New Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 rounded-none border-zinc-200 bg-zinc-50/50"
            />
          </div>
          
          <div>
            <label className="text-[10px] font-bold tracking-[0.15em] text-zinc-500 uppercase mb-2 block">
              Confirm New Password
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="h-12 rounded-none border-zinc-200 bg-zinc-50/50"
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full h-12 rounded-none bg-zinc-900 text-white tracking-widest uppercase hover:bg-zinc-800 transition-colors"
          >
            {isSubmitting ? "PROCESSING..." : "RESET PASSWORD"}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-sm text-zinc-500 tracking-widest uppercase">Loading...</p>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}