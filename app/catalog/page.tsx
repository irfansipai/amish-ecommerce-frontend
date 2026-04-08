// frontend/app/catalog/page.tsx
"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import Link from "next/link"
import Image from "next/image"
import { SlidersHorizontal } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// TypeScript Interface
interface Product {
  id: string
  name: string
  price: number
  image_urls: string[]
  is_featured: boolean
  is_active: boolean
  description?: string
}

const categories = [
  "Women",
  "Handbags",
  "Clothing",
  "Shoes",
  "Purses & Small Accessories",
  "Travel",
  "Accessories",
  "Scarves & Silks",
]

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className={`group cursor-pointer ${product.is_featured ? "col-span-1 md:col-span-2 xl:col-span-2" : "col-span-1"}`}
    >
      <article
        className={`group cursor-pointer ${product.is_featured ? "col-span-1 md:col-span-2 xl:col-span-2" : "col-span-1"
          }`}
      >
        <div className="relative aspect-square overflow-hidden bg-neutral-50">
          <Image
            src={(product.image_urls && product.image_urls[0]) || "/placeholder.svg?height=800&width=600"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={product.is_featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
          />
          {product.is_featured && (
            <div className="absolute bottom-4 left-4">
              <span className="text-[10px] tracking-widest text-foreground/80 underline underline-offset-2 cursor-pointer hover:text-foreground transition-colors">
                Shop Now Women's Shoes
              </span>
            </div>
          )}
        </div>
        <div className="pt-3 pb-6">
          <p className="text-[10px] tracking-wide text-muted-foreground mb-1">
            See More. Buy Now
          </p>
          <h3 className="text-xs font-normal tracking-wide text-foreground leading-tight mb-1">
            {product.name}
          </h3>
          <p className="text-xs text-foreground/80">{formatPrice(product.price)}</p>
        </div>
      </article>
    </Link>
  )
}

function CategoryHero() {
  return (
    <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1920&h=1080&fit=crop"
        alt="Luxury handbag collection"
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
      <div className="absolute bottom-12 left-8 md:left-16">
        <p className="text-[10px] tracking-[0.3em] text-white/70 uppercase mb-2">
          New In
        </p>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-wide">
          Women
        </h1>
        <p className="mt-4 text-xs md:text-sm text-white/80 max-w-md leading-relaxed">
          Shop women's ready-to-wear, accessories, including the latest arrivals from{" "}
          <span className="underline underline-offset-2 cursor-pointer hover:text-white transition-colors">
            Spring Summer 2026
          </span>
        </p>
      </div>
    </section>
  )
}

function CategoryNav() {
  return (
    <nav className="border-b border-border/50 bg-background">
      <div className="px-4 md:px-8 lg:px-16">
        <div className="flex items-center gap-6 overflow-x-auto py-4 scrollbar-hide">
          <span className="text-[10px] tracking-widest text-muted-foreground uppercase whitespace-nowrap">
            What's New / New In
          </span>
          <div className="h-3 w-px bg-border" />
          {categories.map((category, index) => (
            <button
              key={category}
              className={`text-[11px] tracking-wide whitespace-nowrap transition-colors ${index === 0
                  ? "text-foreground font-medium uppercase"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

function FilterSortBar({ itemCount }: { itemCount: number }) {
  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/30">
      <div className="px-4 md:px-8 lg:px-16 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Select defaultValue="recommended">
              <SelectTrigger className="border-0 shadow-none h-auto p-0 text-xs tracking-wide gap-1.5 hover:bg-transparent focus:ring-0">
                <span className="text-muted-foreground">Sort By:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-xs text-muted-foreground tracking-wide">
              {itemCount} Items
            </span>
            <button className="flex items-center gap-2 text-xs tracking-wide text-foreground hover:text-muted-foreground transition-colors">
              <SlidersHorizontal className="size-3.5" />
              Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <section className="px-4 md:px-8 lg:px-16 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-4 gap-y-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [skip, setSkip] = useState(0)
  const [limit] = useState(3)
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)

  const fetchProducts = async (currentSkip: number) => {
    try {
      setIsLoading(true)
      const response = await api.get(`/api/v1/products/?offset=${currentSkip}&limit=${limit}`)
      const productData = response.data

      if (productData.length < limit) {
        setHasMore(false)
      }

      setProducts((prev) => [...prev, ...productData])
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts(0)
  }, [])

  const handleLoadMore = () => {
    const newSkip = skip + limit
    setSkip(newSkip)
    fetchProducts(newSkip)
  }

  if (isLoading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-sm tracking-widest uppercase text-zinc-500 animate-pulse">
          Loading Collection...
        </p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <CategoryNav />
      <CategoryHero />
      <FilterSortBar itemCount={products.length} />
      <ProductGrid products={products} />
      {hasMore && (
        <div className="flex justify-center py-12 pb-24 px-4">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="w-full max-w-sm mx-auto border border-foreground text-foreground h-12 text-xs tracking-[0.2em] uppercase hover:bg-foreground hover:text-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "LOADING..." : "LOAD MORE"}
          </button>
        </div>
      )}
    </main>
  )
}