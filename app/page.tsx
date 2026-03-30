// frontend/app/page.tsx
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


// Main Page Component
export default function LuxuryHomePage() {
  return (
    <div className="bg-white">
      <HeroSection />
      <ProductGrid />
      <CampaignSection />
    </div>
  )
}
