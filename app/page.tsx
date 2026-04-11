// frontend/app/page.tsx
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, Search, ShoppingBag, User, Gift, Plus, ArrowRight, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"

// TypeScript interface for products
interface Product {
  id: string
  name: string
  price: number
  image_urls: string[]
  category: string
}


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
        <Link href="/catalog">
          <Button className="bg-white text-black hover:bg-white/90 rounded-none px-10 py-6 text-sm tracking-[0.2em] font-medium">
            SHOP NOW
          </Button>
        </Link>
      </div>
    </section>
  )
}

// Product Card Component
function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false)

  // Safely grab the first image, or use a placeholder
  const displayImage = product.image_urls?.[0] || "/placeholder.svg?height=800&width=600"

  return (
    <article 
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
        <Image
          src={displayImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className={`object-cover transition-transform duration-700 ${
            isHovered ? "scale-105" : "scale-100"
          }`}
        />
        
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}>
          <Link href={`/product/${product.id}`}>
             <Button className="bg-white text-black hover:bg-white/90 rounded-none px-8 py-5 text-xs tracking-[0.15em] font-medium">
               VIEW DETAILS
             </Button>
          </Link>
        </div>
      </div>

      <div className="pt-5 text-center">
        {product.category && (
          <p className="text-xs tracking-[0.1em] text-slate-500 mb-2">
            {product.category}
          </p>
        )}
        <h3 className="font-serif text-lg font-light text-black mb-2 line-clamp-1">
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
function ProductGrid({ products, isLoading }: { products: Product[], isLoading: boolean }) {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-light tracking-wider text-black mb-4">
            Featured Collection
          </h2>
          <div className="w-16 h-px bg-black mx-auto" />
        </div>

        {isLoading ? (
           <div className="flex justify-center py-20">
             <p className="text-sm tracking-widest text-neutral-400 animate-pulse uppercase">Loading Collection...</p>
           </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
           <div className="text-center py-20">
             <p className="text-sm tracking-widest text-neutral-400 uppercase">No featured products found.</p>
           </div>
        )}

        <div className="text-center mt-16">
          <Link href="/catalog">
            <Button variant="outline" className="rounded-none border-black text-black hover:bg-black hover:text-white px-12 py-6 text-sm tracking-[0.2em] font-medium transition-all duration-300">
              VIEW ALL PRODUCTS
            </Button>
          </Link>
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
        <Link href="/catalog">
          <Button className="bg-white text-black hover:bg-white/90 rounded-none px-10 py-6 text-sm tracking-[0.2em] font-medium">
            SHOP NOW
          </Button>
        </Link>
      </div>
    </section>
  )
}


// Main Page Component
export default function LuxuryHomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setIsLoading(true)
        // Hit the endpoint using the featured flag we set up in the backend
        // We limit to 4 to perfectly fill the 4-column grid on desktop
        const response = await api.get("/api/v1/products/?featured=true&limit=4")
        setFeaturedProducts(response.data)
      } catch (error) {
        console.error("Failed to fetch featured products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])
  return (
    <div className="bg-white">
      <HeroSection />
      <ProductGrid products={featuredProducts} isLoading={isLoading} />
      <CampaignSection />
    </div>
  )
}
