"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { User, Package, LogOut } from "lucide-react"

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { logout } = useAuth()
  const pathname = usePathname()
  const [activeLink, setActiveLink] = useState(pathname === "/account" ? "profile" : "orders")

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?")
    if (confirmed) {
      logout()
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-2">
            <nav className="flex flex-col gap-1">
              <Link
                href="/account"
                onClick={() => setActiveLink("profile")}
                className={`flex items-center gap-3 px-4 py-3 text-sm tracking-wider transition-colors ${
                  activeLink === "profile"
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                <User className="size-4" />
                My Profile
              </Link>
              <Link
                href="/account/orders"
                onClick={() => setActiveLink("orders")}
                className={`flex items-center gap-3 px-4 py-3 text-sm tracking-wider transition-colors ${
                  activeLink === "orders"
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                <Package className="size-4" />
                Order History
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-sm tracking-wider text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors text-left"
              >
                <LogOut className="size-4" />
                Logout
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="bg-white min-h-[600px] p-8 lg:p-12">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}