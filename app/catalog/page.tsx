// frontend/app/catalog/page.tsx
"use client"

import {useEffect, useState } from "react"
import { api } from "@/lib/api";
import Link from "next/link";
import Image from "next/image"
import { SlidersHorizontal } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

// TypeScript Interface
interface Product {
  id: string
  name: string
  price: number
  image_url: string
  is_featured: boolean
  is_active: boolean;
  description?: string;
}

// Mock product data
const initialProducts: Product[] = [
  {
    id: "1",
    name: "Borsettiina Large Boston Bag",
    price: 31600,
    image_url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop",
    is_featured: false,
    is_active: true,
  },
  {
    id: "2",
    name: "Leather Biker Jacket with Web Detail",
    price: 83350,
    image_url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop",
    is_featured: false,
    is_active: true,
  },
  {
    id: "3",
    name: "Silk Leggings",
    price: 14500,
    image_url: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=600&fit=crop",
    is_featured: false,
    is_active: true,
  },
  {
    id: "4",
    name: "Thin Belt with Interlocking G Buckle",
    price: 4750,
    image_url: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&h=600&fit=crop",
    is_featured: false,
    is_active: true,
  },
  {
    id: "5",
    name: "Horsebit Motif Bangle Bracelet",
    price: 10300,
    image_url: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&h=600&fit=crop",
    is_featured: false,
    is_active: true,
  },
  {
    id: "6",
    name: "Women's Diana Pump",
    price: 11500,
    image_url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=600&fit=crop",
    is_featured: false,
    is_active: true,
  },
  {
    id: "7",
    name: "Mask Frame Sunglasses",
    price: 4505,
    image_url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop",
    is_featured: false,
    is_active: true,
  },
  {
    id: "8",
    name: "Horsebit Ristellia Medium Shoulder Bag",
    price: 29400,
    image_url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop",
    is_featured: false,
    is_active: true,
  },
  {
    id: "9",
    name: "Women's Vittoria Pump Collection",
    price: 55500,
    image_url: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600&h=600&fit=crop",
    is_featured: true,
    is_active: true,
  },
  {
    id: "10",
    name: "Women's Villaria Pump",
    price: 11500,
    image_url: "https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?w=600&h=600&fit=crop",
    is_featured: false,
    is_active: true,
  },
  {
    id: "11",
    name: "Horsebit Silk Jacquard Dress",
    price: 32500,
    image_url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=600&fit=crop",
    is_featured: false,
    is_active: true,
  },
  {
    id: "12",
    name: "Gucci Horsebit Diamond 18k Pendant Necklace",
    price: 55550,
    image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop",
    is_featured: false,
    is_active: true,
  },
  {
    id: "13",
    name: "Bamboo Tote Large Bag",
    price: 43500,
    image_url: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&h=600&fit=crop",
    is_featured: true,
    is_active: true,
  },
  {
    id: "14",
    name: "Cotton Jersey T-Shirt with Print",
    price: 8400,
    image_url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop",
    is_featured: false,
    is_active: true,
  },
  {
    id: "15",
    name: "GG Baseball Hat with Web",
    price: 5450,
    image_url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=600&fit=crop",
    is_featured: false,
    is_active: true,
  },
  {
    id: "16",
    name: "Ophidia GG Small Tote Bag",
    price: 18900,
    image_url: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&h=600&fit=crop",
    is_featured: false,
    is_active: true,
  },
]

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
        className={`group cursor-pointer ${
          product.is_featured ? "col-span-1 md:col-span-2 xl:col-span-2" : "col-span-1"
        }`}
      >
        <div className="relative aspect-square overflow-hidden bg-neutral-50">
          <Image
            src={product.image_url ||
            "/placeholder.svg?height=800&width=600"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={product.is_featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
          />
          {product.is_featured && (
            <div className="absolute bottom-4 left-4">
              <span className="text-[10px] tracking-widest text-foreground/80 underline underline-offset-2 cursor-pointer hover:text-foreground transition-colors">
                Shop Now Women&apos;s Shoes
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
          Shop women&apos;s ready-to-wear, accessories, including the latest arrivals from{" "}
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
            What&apos;s New / New In
          </span>
          <div className="h-3 w-px bg-border" />
          {categories.map((category, index) => (
            <button
              key={category}
              className={`text-[11px] tracking-wide whitespace-nowrap transition-colors ${
                index === 0
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

function LoadMoreButton({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <div className="flex justify-center py-12 pb-24">
      <Button
        onClick={onClick}
        disabled={loading}
        className="bg-foreground text-background hover:bg-foreground/90 rounded-none px-16 py-6 h-auto text-xs tracking-[0.2em] uppercase font-normal"
      >
        {loading ? "Loading..." : "Load More"}
      </Button>
    </div>
  )
}

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [loading, setLoading] = useState(false)

useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Hitting your exact Koyeb endpoint
        const response = await api.get("/api/v1/products/?offset=0&limit=100"); 
        
        // Safety check: sometimes paginated APIs return data inside an 'items' array. 
        // This handles both direct arrays and paginated objects.
        const productData = response.data.items || response.data;
        
        // Filter out inactive products so we only show what's available
        const activeProducts = productData.filter((p: Product) => p.is_active);
        setProducts(activeProducts);
        
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-sm tracking-widest uppercase text-zinc-500 animate-pulse">
          Loading Collection...
        </p>
      </div>
    );
  }

  const handleLoadMore = () => {
    setLoading(true)
    // Simulate loading more products
    setTimeout(() => {
      const moreProducts: Product[] = [
        {
          id: `${products.length + 1}`,
          name: "Marmont Matelassé Mini Bag",
          price: 21500,
          image_url: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=600&h=600&fit=crop",
          is_featured: false,
          is_active: true,
        },
        {
          id: `${products.length + 2}`,
          name: "Flora Print Silk Scarf",
          price: 4800,
          image_url: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&h=600&fit=crop",
          is_featured: false,
          is_active: true,
        },
        {
          id: `${products.length + 3}`,
          name: "Dionysus Supreme Canvas Bag",
          price: 28900,
          image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop",
          is_featured: false,
          is_active: true,
        },
        {
          id: `${products.length + 4}`,
          name: "Ace Embroidered Sneaker",
          price: 8700,
          image_url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop",
          is_featured: false,
          is_active: true,
        },
      ]
      setProducts([...products, ...moreProducts])
      setLoading(false)
    }, 1000)
  }

  return (
    <main className="min-h-screen bg-background">
      <CategoryNav />
      <CategoryHero />
      <FilterSortBar itemCount={products.length} />
      <ProductGrid products={products} />
      <LoadMoreButton onClick={handleLoadMore} loading={loading} />
    </main>
  )
}
