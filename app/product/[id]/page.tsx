// frontend/app/product/[id]/page.tsx
"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Phone, MapPin, Sparkles } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { api } from "@/lib/api"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface Product {
  id: string
  name: string
  description: string | null
  price: string
  sku: string
  stock: number
  is_active: boolean
  image_url: string | null
}

interface ProductState {
  id: string
  name: string
  description: string
  price: string
  sku: string
  stock: number
  is_active: boolean
  image_url: string
}

const productDetails = [
  "Black treated calf leather with worn-out effect",
  "Stretch side inserts",
  "Green and red Web leather detail at the sleeves",
  "Tonal lining",
  "Padded collar",
  "Hidden snap buttons at the collar and cuffs",
  "Zip closure at the cuffs",
  "Front zip closure",
  "Regular fit",
  "Total length: 56.8cm; Shoulder: 52.8cm; Chest: 105cm; Sleeves length: 62.4cm; based on a size 48 (IT)",
  "Made in Italy",
  "Genuine leather: Calfskin",
  "Genuine leather: Buffalo",
  "Lining: 75% Acetate, 25% Cotton",
  "Lining: 78% Polyamide, 18% Viscose, 4% Elastane",
  "Lining: 100% Silk",
  "Pocket lining: 100% Cotton"
]

const availableSizes = ["44", "46", "48", "50", "52", "54", "56"]

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>()
  const [openAccordions, setOpenAccordions] = useState<string[]>(["product-details"])
  const [selectedSize, setSelectedSize] = useState(availableSizes[0])
  const [product, setProduct] = useState<ProductState | null>(null)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    const productId = params?.id

    if (!productId) {
      setLoading(false)
      return
    }

    const fetchProduct = async () => {
      setLoading(true)

      try {
        const response = await api.get<Product>(`/api/v1/products/${productId}`)
        const data = response.data

        setProduct({
          ...data,
          description: data.description || "No description available.",
          image_url:
            data.image_url ||
            "/placeholder.svg?height=800&width=600",
        })
      } catch (error) {
        console.error("Failed to fetch product:", error)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params])

  const handleAddToCart = () => {
    if (!product) {
      return
    }

    addToCart({
      product_id: product.id,
      quantity: 1,
      size: selectedSize,
      variant: "Default",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm tracking-widest uppercase text-muted-foreground animate-pulse">
          Loading details...
        </p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm tracking-wide text-muted-foreground">Product not found</p>
      </div>
    )
  }

  return (
    <div className="bg-background">
      {/* Editorial Gallery - Full Width 50/50 Split */}
      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative aspect-[3/4] bg-neutral-100">
            <Image
              src={product.image_url}
              alt={`${product.name} - View 1`}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="relative aspect-[3/4] bg-neutral-100">
            <Image
              src={product.image_url}
              alt={`${product.name} - View 2`}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
          
          {/* Left Column - The Narrative (60%) */}
          <div className="lg:col-span-3">
            {/* Tag */}
            <p className="text-[10px] tracking-[0.2em] text-muted-foreground mb-2">
              SEE NOW, BUY NOW
            </p>
            
            {/* Product Title */}
            <h2 className="font-serif text-xl md:text-2xl font-light tracking-wide mb-3">
              {product.name}
            </h2>
            
            {/* Price */}
            <p className="text-base font-light tracking-wide mb-8">
              {product.price}
            </p>

            {/* Size Accordion */}
            <Accordion 
              type="multiple" 
              value={openAccordions}
              onValueChange={setOpenAccordions}
              className="border-t border-border/40"
            >
              <AccordionItem value="size" className="border-border/40">
                <AccordionTrigger className="text-sm font-light tracking-wide hover:no-underline py-4">
                  Size
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-4 gap-2 pb-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`border py-3 text-sm transition-colors ${
                          selectedSize === size
                            ? "border-foreground bg-foreground text-background"
                            : "border-border/60 hover:border-foreground"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Product Description Section */}
            <div className="mt-10">
              <h3 className="text-sm font-medium tracking-wide mb-2">
                PRODUCT DESCRIPTION
              </h3>
              <p className="text-[11px] text-muted-foreground tracking-wide mb-4">
                Style {product.sku}
              </p>
              <p className="text-sm font-light leading-relaxed text-foreground/90">
                {product.description}
              </p>
            </div>

            {/* Product Details Accordion */}
            <Accordion 
              type="multiple" 
              value={openAccordions}
              onValueChange={setOpenAccordions}
              className="mt-8 border-t border-border/40"
            >
              <AccordionItem value="product-details" className="border-border/40">
                <AccordionTrigger className="text-sm font-light tracking-wide hover:no-underline py-4">
                  Product Details
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-1.5 pb-2">
                    {productDetails.map((detail, index) => (
                      <li key={index} className="text-sm font-light text-foreground/80 flex items-start">
                        <span className="mr-2">•</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="commitment" className="border-border/40">
                <AccordionTrigger className="text-sm font-light tracking-wide hover:no-underline py-4">
                  Our Commitment
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm font-light leading-relaxed text-foreground/80 pb-2">
                    We are committed to providing the finest craftsmanship and materials. Each piece is meticulously 
                    crafted by skilled artisans using time-honored techniques passed down through generations. 
                    Our dedication to sustainability ensures that every product meets the highest ethical standards.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Right Column - The Buy Box (40%) */}
          <div className="lg:col-span-2">
            <div className="sticky top-8">
              {/* Helper Text */}
              <p className="text-sm font-light text-muted-foreground mb-4">
                Select the size of the item to see the expected delivery date.
              </p>

              {/* CTA Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full bg-foreground text-background py-4 text-sm tracking-[0.2em] font-medium hover:bg-foreground/90 transition-colors"
              >
                ADD TO BAG
              </button>

              {/* Utility Links */}
              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                  <div>
                    <p className="text-sm font-light underline underline-offset-2 cursor-pointer hover:opacity-70">
                      Contact Us
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Our Client Advisors are available to help you.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                  <div>
                    <p className="text-sm font-light underline underline-offset-2 cursor-pointer hover:opacity-70">
                      Find in store and Book an appointment
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                  <div>
                    <p className="text-sm font-light underline underline-offset-2 cursor-pointer hover:opacity-70">
                      Maison Services
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Complimentary Shipping, Complimentary Exchanges & Returns, Secure Payments and Signature Packaging
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
