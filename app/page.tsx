"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, Search, ShoppingBag, User, Gift, Plus, ArrowRight, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// TypeScript interface for products
interface Product {
  id: string
  name: string
  price: number
  image_url: string
  category: string
}

// Dummy product data
const featuredProducts: Product[] = [
  {
    id: "1",
    name: "Heritage Leather Tote",
    price: 185000,
    image_url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop",
    category: "Women's Handbags"
  },
  {
    id: "2",
    name: "Signature Stiletto Heels",
    price: 92000,
    image_url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=800&fit=crop",
    category: "Women's Shoes"
  },
  {
    id: "3",
    name: "Classic White Sneakers",
    price: 78000,
    image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=800&fit=crop",
    category: "Men's Sneakers"
  },
  {
    id: "4",
    name: "Monogram Belt Bag",
    price: 125000,
    image_url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop",
    category: "Men's Bags"
  }
]

// Price formatter for Indian Rupees
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

// Navbar Component
function Navbar() {
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
          : "bg-transparent"
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
          <button className="text-white hover:opacity-70 transition-opacity" aria-label="Account">
            <User className="size-5" />
          </button>
          <button className="text-white hover:opacity-70 transition-opacity" aria-label="Search">
            <Search className="size-5" />
          </button>
          <button className="flex items-center gap-2 text-white hover:opacity-70 transition-opacity">
            <Menu className="size-5" />
            <span className="hidden md:inline text-sm tracking-wider">MENU</span>
          </button>
        </div>
      </nav>
    </header>
  )
}

// Hero Section Component
function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1920&h=1080&fit=crop"
          alt="Luxury fashion campaign"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-end h-full pb-24 px-6 text-center">
        <p className="font-serif text-white text-xl md:text-2xl italic mb-6 tracking-wide">
          Introducing the New Collection
        </p>
        <Button 
          className="bg-white text-black hover:bg-white/90 rounded-none px-10 py-6 text-sm tracking-[0.2em] font-medium"
        >
          SHOP NOW
        </Button>
      </div>
    </section>
  )
}

// Product Card Component
function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <article 
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-700 ${
            isHovered ? "scale-105" : "scale-100"
          }`}
        />
        
        {/* Quick Add Overlay */}
        <div 
          className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <Button 
            className="bg-white text-black hover:bg-white/90 rounded-none px-8 py-5 text-xs tracking-[0.15em] font-medium"
          >
            QUICK ADD
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="pt-5 text-center">
        <p className="text-xs tracking-[0.1em] text-slate-500 mb-2">
          {product.category}
        </p>
        <h3 className="font-serif text-lg font-light text-black mb-2">
          {product.name}
        </h3>
        <p className="text-sm tracking-wider text-black">
          {formatPrice(product.price)}
        </p>
      </div>
    </article>
  )
}

// Product Grid Section
function ProductGrid() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-light tracking-wider text-black mb-4">
            Featured Collection
          </h2>
          <div className="w-16 h-px bg-black mx-auto" />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-16">
          <Button 
            variant="outline"
            className="rounded-none border-black text-black hover:bg-black hover:text-white px-12 py-6 text-sm tracking-[0.2em] font-medium transition-all duration-300"
          >
            VIEW ALL PRODUCTS
          </Button>
        </div>
      </div>
    </section>
  )
}

// Secondary Campaign Section
function CampaignSection() {
  return (
    <section className="relative h-[70vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=1080&fit=crop"
          alt="Seasonal campaign"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <h2 className="font-serif text-white text-3xl md:text-5xl font-light tracking-wider mb-6">
          Spring Summer 2026
        </h2>
        <Button 
          className="bg-white text-black hover:bg-white/90 rounded-none px-10 py-6 text-sm tracking-[0.2em] font-medium"
        >
          SHOP NOW
        </Button>
      </div>
    </section>
  )
}

// Footer Component
function Footer() {
  const [email, setEmail] = useState("")

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log("Newsletter signup:", email)
    setEmail("")
  }

  return (
    <footer className="bg-black text-white">
      {/* Main Footer Content */}
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Column 1: Client Services */}
          <div>
            <h3 className="text-xs tracking-[0.2em] text-slate-400 mb-8">
              MAY WE HELP YOU?
            </h3>
            <ul className="space-y-4">
              {["Contact Us", "FAQs", "Email Unsubscribe", "Sitemap"].map((item) => (
                <li key={item}>
                  <Link 
                    href="#" 
                    className="text-sm text-white hover:text-slate-300 underline underline-offset-4 decoration-white/30 hover:decoration-white/60 transition-all"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-xs tracking-[0.2em] text-slate-400 mt-12 mb-8">
              MAISON SERVICES
            </h3>
            <ul className="space-y-4">
              {["Discover Our Services", "Book an Appointment"].map((item) => (
                <li key={item}>
                  <Link 
                    href="#" 
                    className="text-sm text-white hover:text-slate-300 underline underline-offset-4 decoration-white/30 hover:decoration-white/60 transition-all"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: The Company */}
          <div>
            <h3 className="text-xs tracking-[0.2em] text-slate-400 mb-8">
              THE COMPANY
            </h3>
            <ul className="space-y-4">
              {[
                "About Maison",
                "Maison Equilibrium",
                "Code of Ethics",
                "Careers",
                "Legal",
                "Privacy Policy",
                "Cookie Policy",
                "Cookie Settings",
                "Corporate Information",
                "Vulnerability Disclosure Policy"
              ].map((item) => (
                <li key={item}>
                  <Link 
                    href="#" 
                    className="text-sm text-white hover:text-slate-300 underline underline-offset-4 decoration-white/30 hover:decoration-white/60 transition-all"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Store Locator & Newsletter */}
          <div className="lg:col-span-2">
            {/* Store Locator */}
            <h3 className="text-xs tracking-[0.2em] text-slate-400 mb-6">
              STORE LOCATOR
            </h3>
            <button className="w-full flex items-center justify-between py-4 border-b border-white/20 text-left hover:border-white/40 transition-colors group">
              <span className="text-white/70 text-sm">Country/Region, City</span>
              <ChevronRight className="size-5 text-white/50 group-hover:text-white transition-colors" />
            </button>

            {/* Newsletter Signup */}
            <h3 className="text-xs tracking-[0.2em] text-slate-400 mt-12 mb-4">
              SIGN UP FOR MAISON UPDATES
            </h3>
            <p className="text-xs text-white/60 mb-6 leading-relaxed">
              By entering your email address below, you consent to receiving our newsletter with access to our latest collections, events and initiatives. More details on this are provided in our{" "}
              <Link href="#" className="underline hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </p>
            <form onSubmit={handleNewsletterSubmit} className="relative">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-0 border-b border-white/20 rounded-none px-0 py-4 text-white placeholder:text-white/50 focus-visible:ring-0 focus-visible:border-white"
                required
              />
              <button 
                type="submit" 
                className="absolute right-0 top-1/2 -translate-y-1/2 text-white hover:opacity-70 transition-opacity"
                aria-label="Subscribe"
              >
                <ArrowRight className="size-5" />
              </button>
            </form>

            {/* Language & Region */}
            <div className="grid grid-cols-2 gap-8 mt-12">
              <div>
                <h3 className="text-xs tracking-[0.2em] text-slate-400 mb-4">
                  LANGUAGE
                </h3>
                <button className="flex items-center gap-2 text-sm text-white underline underline-offset-4 hover:opacity-70 transition-opacity">
                  English
                  <ChevronRight className="size-4 rotate-90" />
                </button>
              </div>
              <div>
                <h3 className="text-xs tracking-[0.2em] text-slate-400 mb-4">
                  COUNTRY/REGION
                </h3>
                <Link href="#" className="text-sm text-white underline underline-offset-4 hover:opacity-70 transition-opacity">
                  International Site
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10 px-6 lg:px-12 py-8">
        <div className="max-w-[1800px] mx-auto">
          <p className="text-xs text-white/50">
            © 2016 - 2026 Maison S.p.A. - All rights reserved.
          </p>
        </div>
      </div>

      {/* Large Brand Logo */}
      <div className="overflow-hidden pb-8">
        <h2 className="font-serif text-[20vw] font-light tracking-[0.1em] text-white/10 text-center whitespace-nowrap select-none">
          MAISON
        </h2>
      </div>
    </footer>
  )
}

// Main Page Component
export default function LuxuryHomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <ProductGrid />
      <CampaignSection />
      <Footer />
    </main>
  )
}
