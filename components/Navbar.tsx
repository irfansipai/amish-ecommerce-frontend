// frontend/components/Navbar.tsx
"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation" // 1. Import usePathname
import Link from "next/link"
import { Menu, Search, ShoppingBag, User, Gift } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"
import { Sidebar } from "./Sidebar"
import { SearchModal } from "./SearchModal"

function generateAvatar(email: string) {
  return email.charAt(0).toUpperCase()
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname() // 2. Get the current URL path
  const router = useRouter()

  const { user, isLoading } = useAuth()
  const { cartCount } = useCart()

  // 3. Define which pages get the transparent treatment
  const isTransparentPage =
    pathname === "/" ||
    pathname === "/cart" ||
    pathname.startsWith("/product/")

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isMenuOpen || isSearchOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMenuOpen, isSearchOpen])

  // 4. Dynamically set the background class based on the page AND scroll state
  const navbarBackground = isTransparentPage
    ? scrolled
      ? "bg-black/95 backdrop-blur-md border-b border-white/10" // Scrolled on transparent page
      : "bg-transparent"                                        // Top of transparent page
    : "bg-black border-b border-white/10"                       // ALWAYS solid on other pages (Catalog, Auth, etc)

  const isLoggedIn = !!user

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 w-full ${navbarBackground}`}
      >
        <nav className="flex items-center justify-between relative w-full px-6 lg:px-12 py-4">
          {/* Left Side / Mobile Logo */}
          <div className="flex flex-1 items-center justify-start">
            <Link href="/" className="md:hidden">
              <h1 className="font-serif text-2xl font-light tracking-[0.3em] text-white">
                MAISON
              </h1>
            </Link>
          </div>

          {/* Center Logo (Desktop Only) */}
          <div className="hidden md:flex flex-none absolute left-1/2 -translate-x-1/2">
            <Link href="/">
              <h1 className="font-serif text-2xl md:text-3xl font-light tracking-[0.3em] text-white">
                MAISON
              </h1>
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex flex-1 items-center justify-end gap-4 md:gap-6">
            <button className="text-white hover:opacity-70 transition-opacity" aria-label="Gifts">
              <Gift className="size-5" />
            </button>
            <Link
              href={isLoggedIn ? "/account" : "/auth"}
              className="text-white hover:opacity-70 transition-opacity"
              aria-label="Account"
            >
              {isLoading ? (
                <User className="size-5" />
              ) : isLoggedIn && user ? (
                <div className="h-6 w-6 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-medium">
                  {generateAvatar(user.email)}
                </div>
              ) : (
                <User className="size-5" />
              )}
            </Link>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-white hover:opacity-70 transition-opacity"
              aria-label="Search"
            >
              <Search className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (!user) {
                  toast.error("Authentication Required", {
                    description: "Please sign in to view your bag.",
                  });
                  router.push("/auth")
                } else {
                  router.push("/cart")
                }
              }}
              className="relative text-white hover:opacity-70 transition-opacity"
              aria-label="Cart"
            >
              <ShoppingBag className="size-5" />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium leading-none text-white">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(true)}
              className="flex items-center gap-2 text-white hover:opacity-70 transition-opacity"
            >
              <Menu className="size-5" />
              <span className="hidden md:inline text-sm tracking-wider">MENU</span>
            </button>
          </div>
        </nav>
      </header>

      {!isTransparentPage && <div className="h-[57px] w-full" />}

      <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}