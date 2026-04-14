// frontend/app/catalog/page.tsx
"use client"

import { useEffect, useState, Suspense } from "react"
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
import { useSearchParams, useRouter } from "next/navigation"

// --- TypeScript Interfaces ---
interface Product {
  id: string
  name: string
  price: number
  image_urls: string[]
  is_featured: boolean
  is_active: boolean
  description?: string
}

interface Category {
  id: string
  name: string
  slug: string
}

// --- Helper Functions ---
function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// --- Components ---
function ProductCard({ product }: { product: Product }) {
  const displayImage = product.image_urls?.[0] || "/placeholder.svg?height=800&width=600";

  // Define the layout sizing logic cleanly
  const gridSpanClasses = product.is_featured 
    ? "col-span-2 row-span-2" // Featured: 2x Wide, 2x Tall
    : "col-span-1 row-span-1"; // Normal: 1x Wide, 1x Tall
  return (
    <Link
      href={`/product/${product.id}`}
      className={`group cursor-pointer flex flex-col h-full ${gridSpanClasses}`}
    >
      <article className="group cursor-pointer h-full flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-neutral-50 flex-grow">
          <Image
            src={displayImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={product.is_featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
          />
          {product.is_featured && (
            <div className="absolute bottom-4 left-4">
              <span className="text-[10px] tracking-widest text-foreground/80 underline underline-offset-2 cursor-pointer hover:text-foreground transition-colors">
                Featured Collection
              </span>
            </div>
          )}
        </div>
        <div className="pt-3 pb-6 flex-shrink-0">
          <h3 className="text-xs font-normal tracking-wide text-foreground leading-tight mb-1 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-foreground/80">{formatPrice(product.price)}</p>
        </div>
      </article>
    </Link>
  )
}

function CategoryHero({ activeCategoryName }: { activeCategoryName: string }) {
  return (
    <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1920&h=1080&fit=crop"
        alt="Luxury collection"
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="absolute bottom-12 left-8 md:left-16">
        <p className="text-[10px] tracking-[0.3em] text-white/70 uppercase mb-2">
          Collection
        </p>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-wide capitalize">
          {activeCategoryName || "All Ready-To-Wear"}
        </h1>
      </div>
    </section>
  )
}

function CategoryNav({ 
  categories, 
  activeCategory, 
  onSelectCategory 
}: { 
  categories: Category[], 
  activeCategory: string, 
  onSelectCategory: (slug: string) => void 
}) {
  return (
    <nav className="border-b border-border/50 bg-background">
      <div className="px-4 md:px-8 lg:px-16">
        <div className="flex items-center gap-6 overflow-x-auto py-4 scrollbar-hide">
          <button
            onClick={() => onSelectCategory("")}
            className={`text-[11px] tracking-wide whitespace-nowrap transition-colors uppercase ${
              activeCategory === "" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All Products
          </button>
          
          <div className="h-3 w-px bg-border flex-shrink-0" />
          
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.slug)}
              className={`text-[11px] tracking-wide whitespace-nowrap transition-colors uppercase ${
                  activeCategory === category.slug
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

function FilterSortBar({ 
  itemCount, 
  sortBy, 
  onSortChange 
}: { 
  itemCount: number, 
  sortBy: string, 
  onSortChange: (val: string) => void 
}) {
  return (
    <div className="sticky top-[60px] z-40 bg-background/95 backdrop-blur-sm border-b border-border/30">
      <div className="px-4 md:px-8 lg:px-16 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="border-0 shadow-none h-auto p-0 text-xs tracking-wide gap-1.5 hover:bg-transparent focus:ring-0">
                <span className="text-muted-foreground tracking-widest text-[10px]">Sort By:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[10px] tracking-widest text-muted-foreground hidden md:inline-block">
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 grid-flow-row-dense">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

// --- Content Component (uses useSearchParams) ---
function CatalogContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Read the initial category from the URL, fallback to ""
  const urlCategory = searchParams.get("category") || ""

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  
  // Initialize state with the URL parameter
  const [activeCategory, setActiveCategory] = useState<string>(urlCategory)
  const [sortBy, setSortBy] = useState<string>("newest")
  
  // Pagination States
  const [skip, setSkip] = useState(0)
  const [limit] = useState(12) 
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    const newCategory = searchParams.get("category") || ""
    setActiveCategory(newCategory)
  }, [searchParams])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/v1/categories/")
        setCategories(response.data)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }
    fetchCategories()
  }, [])

  const fetchProducts = async (currentSkip: number, isReset: boolean = false) => {
    try {
      setIsLoading(true)
      
      let url = `/api/v1/products/?offset=${currentSkip}&limit=${limit}&sort=${sortBy}`
      if (activeCategory) {
        url += `&category=${activeCategory}`
      }

      const response = await api.get(url)
      const productData = response.data

      setHasMore(productData.length === limit)

      if (isReset) {
        setProducts(productData) 
      } else {
        setProducts((prev) => [...prev, ...productData]) 
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setSkip(0) 
    fetchProducts(0, true) 
  }, [activeCategory, sortBy])

  const handleLoadMore = () => {
    const newSkip = skip + limit
    setSkip(newSkip)
    fetchProducts(newSkip, false)
  }

  const handleCategorySelect = (slug: string) => {
    setActiveCategory(slug)
    if (slug) {
      router.push(`/catalog?category=${slug}`, { scroll: false })
    } else {
      router.push(`/catalog`, { scroll: false })
    }
  }
    
  const currentCategoryName = categories.find(c => c.slug === activeCategory)?.name || ""

  return (
    <>
      <CategoryNav 
        categories={categories} 
        activeCategory={activeCategory} 
        onSelectCategory={handleCategorySelect} 
      />
      <CategoryHero activeCategoryName={currentCategoryName} />
      
      <FilterSortBar 
        itemCount={products.length} 
        sortBy={sortBy} 
        onSortChange={setSortBy} 
      />
      
      {isLoading && products.length === 0 ? (
        <div className="flex items-center justify-center py-32 bg-white">
          <p className="text-sm tracking-widest uppercase text-zinc-500 animate-pulse">
            Curating Collection...
          </p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex items-center justify-center py-32 bg-white">
          <p className="text-sm tracking-widest uppercase text-zinc-500">
            No products found in this category.
          </p>
        </div>
      ) : (
        <>
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
        </>
      )}
    </>
  )
}

// --- Main Page Export with Suspense ---
export default function CatalogPage() {
  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen bg-background">
          <p className="text-sm tracking-widest uppercase text-zinc-500 animate-pulse">
            Loading Catalog...
          </p>
        </div>
      }>
        <CatalogContent />
      </Suspense>
    </main>
  )
}
