// frontend/components/Navbar.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, Search, ShoppingBag, User, Gift, Plus } from "lucide-react"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-black/95 backdrop-blur-md border-b border-white/10" 
          : "bg-black/80 backdrop-blur-sm" // Ensures visibility on all pages
      }`}
    >
      <nav className="flex items-center justify-between px-6 lg:px-12 py-4">
        {/* Left Side */}
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-white text-sm tracking-wider hover:opacity-70 transition-opacity">
            <Plus className="size-4" />
            <span className="hidden sm:inline">Contact Us</span>
          </button>
        </div>

        {/* Center Logo */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <h1 className="font-serif text-2xl md:text-3xl font-light tracking-[0.3em] text-white">
            MAISON
          </h1>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-4 md:gap-6">
          <button className="text-white hover:opacity-70 transition-opacity" aria-label="Gifts">
            <Gift className="size-5" />
          </button>
          <Link href="/auth" className="text-white hover:opacity-70 transition-opacity" aria-label="Account">
            <User className="size-5" />
          </Link>
          <button className="text-white hover:opacity-70 transition-opacity" aria-label="Search">
            <Search className="size-5" />
          </button>
          <Link href="/cart" className="text-white hover:opacity-70 transition-opacity" aria-label="Cart">
             <ShoppingBag className="size-5" />
          </Link>
          <button className="flex items-center gap-2 text-white hover:opacity-70 transition-opacity">
            <Menu className="size-5" />
            <span className="hidden md:inline text-sm tracking-wider">MENU</span>
          </button>
        </div>
      </nav>
    </header>
  )
}