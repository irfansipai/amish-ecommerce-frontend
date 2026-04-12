// app/account/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { toast } from "sonner" // Assuming you use sonner for toasts, or replace with your toast library
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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

  // Form States
  const [newEmail, setNewEmail] = useState("")
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false)

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  const fetchUser = async () => {
    try {
      const response = await api.get<UserData>("/api/v1/users/me")
      setUser(response.data)
      setNewEmail(response.data.email)
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

  useEffect(() => {
    fetchUser()
  }, [router])

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newEmail === user?.email) return

    setIsUpdatingEmail(true)
    try {
      await api.patch("/api/v1/users/me/email", { email: newEmail })
      toast.success("Email updated. Please check your inbox to verify the new email.")
      await fetchUser() // Refresh user data to show unverified status if applicable
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to update email.")
    } finally {
      setIsUpdatingEmail(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match.")
      return
    }

    if (passwords.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.")
      return
    }

    setIsUpdatingPassword(true)
    try {
      await api.patch("/api/v1/users/me/password", {
        current_password: passwords.currentPassword,
        new_password: passwords.newPassword,
      })
      toast.success("Password updated successfully.")
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to update password.")
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-6 animate-spin text-zinc-400" />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-red-600 tracking-wider">{error}</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-12">
      <div>
        <h1 className="text-2xl font-light tracking-[0.2em] text-zinc-900 mb-2">
          MY PROFILE
        </h1>
        <p className="text-sm text-zinc-500">Manage your account settings and preferences.</p>
      </div>

      <div className="grid gap-8">
        {/* Avatar & Verification Status */}
        <div className="border border-zinc-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 rounded-full bg-zinc-900 text-white flex items-center justify-center text-2xl font-medium flex-shrink-0">
              {generateAvatar(user.email)}
            </div>
            <div>
              <h2 className="text-base text-zinc-900 font-medium">{user.email}</h2>
              <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">ID: {user.id.slice(0, 8)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-100 bg-zinc-50">
            {user.is_verified ? (
              <>
                <CheckCircle2 className="size-4 text-green-600" />
                <span className="text-xs font-bold tracking-[0.1em] text-green-800 uppercase">Verified</span>
              </>
            ) : (
              <>
                <AlertCircle className="size-4 text-yellow-600" />
                <span className="text-xs font-bold tracking-[0.1em] text-yellow-800 uppercase">Unverified</span>
              </>
            )}
          </div>
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

        {/* Change Email Form */}
        <form onSubmit={handleUpdateEmail} className="border border-zinc-200 p-6 space-y-4">
          <div>
            <h2 className="text-[10px] font-bold tracking-[0.15em] text-zinc-500 uppercase mb-1">
              Email Address
            </h2>
            <p className="text-xs text-zinc-400 mb-4">Update the email address associated with your account.</p>
          </div>
          
          <div className="flex gap-4">
            <Input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="h-12 rounded-none border-zinc-200 bg-zinc-50/50 text-sm focus-visible:border-zinc-900 focus-visible:ring-0 flex-1"
              required
            />
            <Button 
              type="submit" 
              disabled={isUpdatingEmail || newEmail === user.email}
              className="h-12 rounded-none bg-zinc-900 text-white px-8 text-xs tracking-widest uppercase hover:bg-zinc-800"
            >
              {isUpdatingEmail ? "SAVING..." : "UPDATE"}
            </Button>
          </div>
        </form>

        {/* Change Password Form */}
        <form onSubmit={handleUpdatePassword} className="border border-zinc-200 p-6 space-y-6">
          <div>
            <h2 className="text-[10px] font-bold tracking-[0.15em] text-zinc-500 uppercase mb-1">
              Change Password
            </h2>
            <p className="text-xs text-zinc-400">Ensure your account is using a long, random password to stay secure.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold tracking-[0.15em] text-zinc-500 uppercase mb-2 block">
                Current Password
              </label>
              <Input
                type="password"
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handlePasswordChange}
                className="h-12 rounded-none border-zinc-200 bg-zinc-50/50 text-sm focus-visible:border-zinc-900 focus-visible:ring-0"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold tracking-[0.15em] text-zinc-500 uppercase mb-2 block">
                  New Password
                </label>
                <Input
                  type="password"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  className="h-12 rounded-none border-zinc-200 bg-zinc-50/50 text-sm focus-visible:border-zinc-900 focus-visible:ring-0"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold tracking-[0.15em] text-zinc-500 uppercase mb-2 block">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                  className="h-12 rounded-none border-zinc-200 bg-zinc-50/50 text-sm focus-visible:border-zinc-900 focus-visible:ring-0"
                  required
                />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isUpdatingPassword}
            className="h-12 rounded-none bg-zinc-900 text-white px-8 text-xs tracking-widest uppercase hover:bg-zinc-800 w-full sm:w-auto"
          >
            {isUpdatingPassword ? "UPDATING..." : "UPDATE PASSWORD"}
          </Button>
        </form>
      </div>
    </div>
  )
}