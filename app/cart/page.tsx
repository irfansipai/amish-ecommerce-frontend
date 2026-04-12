// app/cart/page.tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Minus, Phone, Mail, Heart } from "lucide-react"
import { api } from "@/lib/api"
import { toast } from "sonner"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { useCart, type CartItem } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import { useSavedItems } from "@/context/SavedItemsContext"

// Format price with Indian Rupees (INR)
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

const normalizePrice = (price: number | string) =>
  typeof price === "number" ? price : Number.parseFloat(price)

export default function ShoppingBagPage() {
  const { user } = useAuth()
  const { toggleSavedItem, isSaved } = useSavedItems()

  const router = useRouter()

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editAttributes, setEditAttributes] = useState<Record<string, string>>({});
  const [availableOptions, setAvailableOptions] = useState<Record<string, string[]>>({});
  const [isFetchingOptions, setIsFetchingOptions] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/auth")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const { cartItems, cartSummary, updateQuantity, removeFromCart, updateCartItem, isLoading } = useCart()

  // All totals come directly from the backend — no local math
  const { subtotal, tax_amount, shipping_amount, grand_total } = cartSummary

  const isEmpty = !isLoading && cartItems.length === 0
  const getItemStyle = (item: CartItem) => {
    return item.product_id.split("-")[0].toUpperCase()
  }

  // Handle Quantity Increment/Decrement
  const handleQuantityChange = (id: string, currentQty: number, change: number) => {
    const newQty = currentQty + change;
    if (newQty > 0 && newQty <= 10) { // Assuming a max of 10 items per product
      updateQuantity(id, newQty);
    }
  }

  const handleEditClick = async (item: CartItem) => {
    setEditingItemId(item.id);
    setEditAttributes(item.attributes || {});
    setIsFetchingOptions(true);

    try {
      // Fetch the full product to see what attributes are actually available
      const response = await api.get(`/api/v1/products/${item.product_id}`);
      setAvailableOptions(response.data.attributes || {});
    } catch (error) {
      toast.error("Failed to load product options.");
      setEditingItemId(null);
    } finally {
      setIsFetchingOptions(false);
    }
  };

  const handleSaveEdit = async (itemId: string) => {
    await updateCartItem(itemId, { attributes: editAttributes });
    setEditingItemId(null);
    toast.success("Item updated successfully.");
  };
  return (
    <div className="bg-background">
      {/* Hero Banner */}
      <section className="relative h-[280px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-fixed bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2832&auto=format&fit=crop')]">
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative flex h-full items-center justify-center">
          <h2 className="font-serif text-4xl md:text-5xl font-light tracking-[0.2em] text-white">
            SHOPPING BAG
          </h2>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <div className="flex size-10 items-center justify-center rounded-full bg-foreground">
            <span className="font-serif text-xs text-background">M</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-12">
        {isLoading ? (
          <div className="flex min-h-[320px] items-center justify-center border text-center">
            <h3 className="text-xs font-medium tracking-[0.15em] uppercase animate-pulse text-muted-foreground">
              Loading Shopping Bag...
            </h3>
          </div>
        ) : isEmpty ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center border text-center">
            <h3 className="text-xs font-medium tracking-[0.15em] uppercase">
              Your Shopping Bag is Empty
            </h3>
            <Link href="/catalog" className="mt-6 block">
              <Button className="h-12 rounded-none bg-foreground px-8 text-xs tracking-[0.2em] uppercase text-background hover:bg-foreground/90">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Left Column - Cart Items */}
            <div className="lg:col-span-8">
              {/* Header */}
              <div className="mb-8 flex items-center justify-between border-b pb-4">
                <h3 className="text-xs font-medium tracking-[0.15em] uppercase">
                  Your Selections
                </h3>
              </div>

              {/* Cart Items */}
              <div className="divide-y">
                {cartItems.map((item) => {
                  // Fallback for image array
                  const displayImage = item.image_urls?.[0] || "/placeholder.svg?height=800&width=600";

                  return (
                    <div key={item.id} className="py-8">
                      <div className="flex gap-6">
                        {/* Product Image */}
                        <div className="relative size-32 flex-shrink-0 bg-muted">
                          <Image
                            src={displayImage}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Product Details & Edit Mode */}
                        <div className="flex flex-1 flex-col justify-between">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1.5 w-full">
                              <Link href={`/product/${item.product_id}`}>
                                <h4 className="text-sm font-normal hover:underline underline-offset-4 cursor-pointer">
                                  {item.name}
                                </h4>
                              </Link>

                              {/* --- INLINE EDIT UI --- */}
                              {editingItemId === item.id ? (
                                <div className="mt-4 p-4 border border-border/60 bg-muted/20 w-full max-w-sm space-y-4">
                                  {isFetchingOptions ? (
                                    <p className="text-xs text-muted-foreground animate-pulse tracking-wide uppercase">
                                      Loading options...
                                    </p>
                                  ) : (
                                    <>
                                      {Object.entries(availableOptions).map(([attrName, options]) => (
                                        <div key={attrName}>
                                          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                                            {attrName}
                                          </p>
                                          <div className="flex flex-wrap gap-2">
                                            {options.map((opt) => (
                                              <button
                                                key={opt}
                                                onClick={() => setEditAttributes(prev => ({ ...prev, [attrName]: opt }))}
                                                className={`border px-3 py-1.5 text-xs transition-colors ${editAttributes[attrName] === opt
                                                    ? "bg-foreground text-background border-foreground"
                                                    : "bg-background text-foreground border-border hover:border-foreground"
                                                  }`}
                                              >
                                                {opt}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      ))}

                                      <div className="flex items-center gap-3 pt-2">
                                        <button
                                          onClick={() => handleSaveEdit(item.id)}
                                          className="text-xs tracking-widest uppercase bg-foreground text-background px-4 py-2 hover:bg-foreground/90 transition-colors"
                                        >
                                          Save
                                        </button>
                                        <button
                                          onClick={() => setEditingItemId(null)}
                                          className="text-xs tracking-widest uppercase border border-border px-4 py-2 hover:bg-muted transition-colors"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              ) : (
                                /* --- STANDARD DISPLAY MODE --- */
                                <>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Style# {getItemStyle(item)}
                                  </p>
                                  {item.attributes && Object.entries(item.attributes).map(([key, value]) => (
                                    <p key={key} className="text-xs text-muted-foreground">
                                      {key}: {value}
                                    </p>
                                  ))}

                                  <button
                                    onClick={() => handleEditClick(item)}
                                    className="text-[10px] tracking-widest uppercase underline underline-offset-4 text-muted-foreground hover:text-foreground mt-2 block transition-colors"
                                  >
                                    Edit Details
                                  </button>
                                </>
                              )}
                            </div>

                            {/* Custom +/- Quantity & Price */}
                            <div className="flex items-start gap-8">
                              <div className="flex items-center border border-foreground/20 h-10">
                                <button
                                  onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                  className="px-3 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  <Minus className="size-3" />
                                </button>
                                <span className="w-8 text-center text-xs font-medium">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                                  className="px-3 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  <Plus className="size-3" />
                                </button>
                              </div>
                              <span className="text-sm font-normal whitespace-nowrap mt-2.5">
                                {formatPrice(normalizePrice(item.price))}
                              </span>
                            </div>
                          </div>

                          {/* Action Links */}
                          <div className="mt-6 flex items-center gap-4 text-xs">
                            <button
                              className="underline underline-offset-4 hover:no-underline text-muted-foreground transition-colors hover:text-foreground"
                              onClick={() => removeFromCart(item.id)}
                            >
                              Remove Item
                            </button>
                            <button
                              className="flex items-center gap-1.5 hover:underline"
                              onClick={() => toggleSavedItem(item.product_id)}
                            >
                              <Heart
                                className={`size-3 transition-colors ${isSaved(item.product_id) ? "fill-foreground text-foreground" : ""
                                  }`}
                              />
                              <span>{isSaved(item.product_id) ? "Saved" : "Save Item"}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                {/* Order Summary Box */}
                <div className="border p-6">
                  <h3 className="text-xs font-medium tracking-[0.15em] uppercase">
                    Order Summary
                  </h3>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tax (GST)</span>
                      <span>{formatPrice(tax_amount)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm pt-2">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-xs">
                        {shipping_amount === 0 ? "Free" : formatPrice(shipping_amount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t pt-4 mt-4">
                      <span className="text-sm font-medium uppercase tracking-wide">
                        Grand Total
                      </span>
                      <span className="text-lg font-normal">{formatPrice(grand_total)}</span>
                    </div>
                  </div>

                  {/* Charge Notice */}
                  <p className="mt-6 text-xs text-muted-foreground leading-relaxed">
                    Taxes and shipping are calculated based on Indian standard rates.
                    Final amount will be charged securely at checkout.
                  </p>

                  {/* Checkout Button */}
                  <Link href="/checkout" className="w-full mt-6 block">
                    <Button className="w-full h-12 rounded-none bg-foreground text-background text-xs tracking-[0.2em] uppercase hover:bg-foreground/90">
                      Proceed to Checkout
                    </Button>
                  </Link>
                </div>

                {/* Help Section */}
                <div className="border">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="help" className="border-b px-6">
                      <AccordionTrigger className="text-xs tracking-wide uppercase hover:no-underline">
                        May We Help?
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 pb-2">
                          <a
                            href="tel:+919876543210"
                            className="flex items-center gap-3 text-sm hover:underline"
                          >
                            <Phone className="size-4" />
                            <span>+91 98765 43210</span>
                          </a>
                          <a
                            href="mailto:clientservices@maison.com"
                            className="flex items-center gap-3 text-sm hover:underline"
                          >
                            <Mail className="size-4" />
                            <span className="underline">
                              clientservices@maison.com
                            </span>
                          </a>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="payment" className="border-b px-6">
                      <AccordionTrigger className="text-xs tracking-wide uppercase hover:no-underline">
                        Accepted Payment Methods
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground">
                          We accept all major Credit/Debit Cards, UPI (GPay, PhonePe), and Net Banking.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="shipping" className="border-0 px-6">
                      <AccordionTrigger className="text-xs tracking-wide uppercase hover:no-underline">
                        Shipping Options
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground">
                          Standard secure shipping across India. Delivery within
                          3-7 business days depending on location.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}