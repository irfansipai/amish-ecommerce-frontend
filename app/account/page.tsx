"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { CheckCircle2, AlertCircle } from "lucide-react"

interface UserData {
  id: string
  email: string
  is_admin: boolean
  is_verified: boolean
}

function generateAvatar(email: string) {
  return email.charAt(0).toUpperCase()
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get<UserData>("/api/v1/users/me")
        setUser(response.data)
      } catch (err: any) {
        if (err.response?.status === 401) {
          router.push("/auth")
          return
        }
        setError("Failed to load profile information")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-zinc-500 tracking-wider">LOADING...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-red-600 tracking-wider">{error}</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-light tracking-[0.2em] text-zinc-900 mb-10">
        MY PROFILE
      </h1>

      <div className="grid gap-8">
        {/* Avatar Card */}
        <div className="border border-zinc-200 p-6 flex items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-zinc-900 text-white flex items-center justify-center text-3xl font-medium flex-shrink-0">
            {user?.email ? generateAvatar(user.email) : "?"}
          </div>
          <div>
            <h2 className="text-base text-zinc-900 font-medium">{user?.email}</h2>
            <p className="text-sm text-zinc-500 mt-1">Account ID: {user?.id.slice(0, 8)}</p>
          </div>
        </div>

        {/* Email Card */}
        <div className="border border-zinc-200 p-6">
          <h2 className="text-[10px] font-bold tracking-[0.15em] text-zinc-500 uppercase mb-3">
            Email Address
          </h2>
          <p className="text-base text-zinc-900">{user?.email}</p>
        </div>

        {/* Account Status Card */}
        {user?.is_admin ? (
        <div className="border border-zinc-200 p-6">
          <h2 className="text-[10px] font-bold tracking-[0.15em] text-zinc-500 uppercase mb-3">
            Admin Status
          </h2>
          <div className="flex items-center gap-3">
              <>
                <CheckCircle2 className="size-5 text-green-600" />
                <span className="text-base text-green-600 font-medium">Active</span>
              </>
          </div>
        </div>
            ) : (
              <>
                {/* <AlertCircle className="size-5 text-zinc-400" />
                <span className="text-base text-zinc-400 font-medium">Inactive</span> */}
              </>
            )}

        {/* Verification Status Card */}
        <div className="border border-zinc-200 p-6">
          <h2 className="text-[10px] font-bold tracking-[0.15em] text-zinc-500 uppercase mb-3">
            Email Verification
          </h2>
          <div className="flex items-center gap-3">
            {user?.is_verified ? (
              <>
                <CheckCircle2 className="size-5 text-green-600" />
                <span className="inline-flex items-center px-3 py-1 text-xs font-bold tracking-[0.1em] bg-green-100 text-green-800 rounded-full">
                  Verified
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="size-5 text-yellow-600" />
                <span className="inline-flex items-center px-3 py-1 text-xs font-bold tracking-[0.1em] bg-yellow-100 text-yellow-800 rounded-full">
                  Unverified
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}