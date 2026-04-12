// frontend/app/saved-items/page.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Heart, X } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useSavedItems } from "@/context/SavedItemsContext"
import { Button } from "@/components/ui/button"

export default function SavedItemsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { savedItems, isLoading, toggleSavedItem } = useSavedItems()

  // Redirect unauthenticated users
  useEffect(() => {
    if (!user) {
      router.push("/auth")
    }
  }, [user, router])

  if (!user) return null

  // Re-use your global price formatter
  const formatPrice = (price: number | string) => {
    const num = typeof price === "string" ? parseFloat(price) : price
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(num)
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6 md:px-12 max-w-[1800px] mx-auto">
      <div className="flex items-center justify-between mb-12 border-b border-border pb-6">
        <h1 className="font-serif text-3xl font-light tracking-wide uppercase">
          Saved Items
        </h1>
        <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
          {savedItems.length} {savedItems.length === 1 ? "Item" : "Items"}
        </span>
      </div>

      {isLoading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground animate-pulse">
            Loading Wishlist...
          </p>
        </div>
      ) : savedItems.length === 0 ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center space-y-6">
          <Heart className="w-12 h-12 text-muted-foreground/30" strokeWidth={1} />
          <div>
            <h2 className="text-sm tracking-[0.1em] uppercase mb-2">Your wishlist is empty</h2>
            <p className="text-xs text-muted-foreground">Save items you love to build your personal collection.</p>
          </div>
          <Link href="/catalog">
            <Button className="mt-4 rounded-none bg-foreground text-background px-8 h-12 text-xs tracking-[0.2em] uppercase hover:bg-foreground/90">
              Discover Fashion
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12">
          {savedItems.map((item) => {
            const product = item.product
            const displayImage = product.image_urls?.[0] || "/placeholder.svg?height=800&width=600"

            return (
              <article key={item.id} className="group relative flex flex-col h-full">
                {/* Remove Button Overlay */}
                <button
                  onClick={() => toggleSavedItem(item.product_id)}
                  className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  title="Remove from Saved"
                >
                  <X className="w-4 h-4 text-black" strokeWidth={1.5} />
                </button>

                <Link href={`/product/${item.product_id}`} className="flex-grow flex flex-col cursor-pointer">
                  <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50 mb-4">
                    <Image
                      src={displayImage}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex-shrink-0">
                    <h3 className="text-xs font-normal tracking-wide text-foreground leading-tight mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-foreground/80">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </Link>
                
                {/* Quick Add / View Button */}
                <Link href={`/product/${item.product_id}`} className="mt-4">
                  <button className="w-full border border-border py-3 text-[10px] tracking-[0.2em] uppercase hover:border-foreground hover:bg-foreground hover:text-background transition-all">
                    View Details
                  </button>
                </Link>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}