// frontend/app/cart/page.tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import {
  Plus,
  Printer,
  Heart,
  Phone,
  Mail,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { useCart, type CartItem } from "@/context/CartContext"

// Format price with Korean Won
const formatPrice = (price: number) => {
  return `KR ${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ".")}`
}

const normalizePrice = (price: number | string) =>
  typeof price === "number" ? price : Number.parseFloat(price)

export default function ShoppingBagPage() {
  const { cartItems, updateQuantity, removeFromCart, isLoading } = useCart()

  // Calculate totals
  const subtotal = cartItems.reduce(
    (acc, item) => acc + normalizePrice(item.price) * item.quantity,
    0
  )
  const vatRate = 0.2
  const vat = subtotal * vatRate
  const total = subtotal
  const isEmpty = !isLoading && cartItems.length === 0
  const getItemStyle = (item: CartItem) =>
    (item as CartItem & { style?: string }).style ?? item.product_id

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
        {/* Logo Icon */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <div className="flex size-10 items-center justify-center rounded-full bg-foreground">
            <span className="font-serif text-xs text-background">L</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-12">
        {isLoading ? (
          <div className="flex min-h-[320px] items-center justify-center border text-center">
            <h3 className="text-xs font-medium tracking-[0.15em] uppercase">
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
                <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <Printer className="size-4" />
                  <span>Print</span>
                </button>
              </div>

              {/* Cart Items */}
              <div className="divide-y">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-8">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="relative size-32 flex-shrink-0 bg-muted">
                        <Image
                          src={item.image_url ?? "/placeholder.svg?height=800&width=600"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1.5">
                            <h4 className="text-sm font-normal">{item.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              Style# {getItemStyle(item)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Variation: {item.variant ?? "Default"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Size: {item.size ?? "One Size"}
                            </p>
                          </div>

                          {/* Quantity & Price */}
                          <div className="flex items-start gap-8">
                            <Select
                              value={item.quantity.toString()}
                              onValueChange={(value) =>
                                updateQuantity(item.id, parseInt(value, 10))
                              }
                            >
                              <SelectTrigger className="w-24 h-10 text-xs border-foreground/20">
                                <SelectValue placeholder="QTY" />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5].map((num) => (
                                  <SelectItem key={num} value={num.toString()}>
                                    QTY: {num}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <span className="text-sm font-normal whitespace-nowrap">
                              {formatPrice(normalizePrice(item.price))}
                            </span>
                          </div>
                        </div>

                        {/* Action Links */}
                        <div className="mt-6 flex items-center gap-4 text-xs">
                          <button className="underline underline-offset-4 hover:no-underline">
                            Edit
                          </button>
                          <span className="text-muted-foreground">|</span>
                          <button
                            className="underline underline-offset-4 hover:no-underline"
                            onClick={() => removeFromCart(item.id)}
                          >
                            Remove
                          </button>
                          <span className="text-muted-foreground">|</span>
                          <button className="flex items-center gap-1.5 hover:underline">
                            <Heart className="size-3" />
                            <span>Saved Items</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
                  <p className="mt-1 text-xs text-muted-foreground">
                    NOCART423823978
                  </p>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Shipping</span>
                      <span className="text-xs text-muted-foreground">
                        KR 0 (DHL Express Worldwide) ∨
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t pt-4">
                      <span className="text-sm font-medium uppercase tracking-wide">
                        Total
                      </span>
                      <span className="text-lg font-normal">
                        {formatPrice(total)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">VAT (Included)</span>
                      <span className="text-muted-foreground">
                        {formatPrice(vat)}
                      </span>
                    </div>
                  </div>

                  {/* View Details */}
                  <button className="mt-6 flex w-full items-center justify-between text-xs font-medium tracking-wide uppercase border-t pt-4">
                    <span>View Details</span>
                    <Plus className="size-4" />
                  </button>

                  {/* Charge Notice */}
                  <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                    You will be charged only at the time of shipment except for{" "}
                    <span className="underline">DIY orders</span> where the full
                    amount is charged at the time of purchase.
                  </p>

                  {/* Checkout Button */}
                  <Link href="/checkout" className="w-full mt-6 block">
                    <Button className="mt-6 w-full h-12 rounded-none bg-foreground text-background text-xs tracking-[0.2em] uppercase hover:bg-foreground/90">
                      Checkout
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
                            href="tel:+390550622951"
                            className="flex items-center gap-3 text-sm hover:underline"
                          >
                            <Phone className="size-4" />
                            <span>+39 0550622951</span>
                          </a>
                          <a
                            href="mailto:assistance@no-onlineshopping.luxe.com"
                            className="flex items-center gap-3 text-sm hover:underline"
                          >
                            <Mail className="size-4" />
                            <span className="underline">
                              assistance@no-onlineshopping.luxe.com
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
                          We accept Visa, Mastercard, American Express, PayPal,
                          Apple Pay, and Google Pay.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="shipping" className="border-0 px-6">
                      <AccordionTrigger className="text-xs tracking-wide uppercase hover:no-underline">
                        Shipping Options
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground">
                          Complimentary express shipping via DHL. Delivery within
                          2-5 business days worldwide.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* You May Also Like Section */}
        <section className="mt-20 border-t pt-12">
          <h3 className="text-center text-xs font-medium tracking-[0.2em] uppercase">
            You May Also Like
          </h3>
          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="group">
                <div className="aspect-[3/4] bg-muted transition-opacity group-hover:opacity-90" />
                <div className="mt-4 space-y-1">
                  <p className="text-xs text-muted-foreground">Product Name</p>
                  <p className="text-sm">KR 12.000,00</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
