// frontend/app/checkout/page.tsx
"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Package, CreditCard, ShieldCheck } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/context/CartContext"
import { api } from "@/lib/api"


function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount)
}

function normalizePrice(price: number | string) {
  return typeof price === "number" ? price : Number.parseFloat(price)
}

export default function CheckoutPage() {
  const { cartItems, cartSummary, clearCart, isLoading } = useCart()
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  })
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isLoading) {
      return
    }

    if (cartItems.length === 0) {
      router.push("/cart")
    }
  }, [cartItems, isLoading, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // All totals come directly from the backend via cartSummary — no local math
  const { subtotal, tax_amount, shipping_amount, grand_total } = cartSummary

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setIsSubmitting(true)

    const requiredFields = [
      formData.firstName, formData.lastName, formData.email,
      formData.phone, formData.address, formData.city,
      formData.state, formData.pincode
    ];

    // Check if any required field is empty or just whitespace
    if (requiredFields.some(field => !field || field.trim() === "")) {
      setErrorMessage("Please fill out all required shipping fields.")
      setIsSubmitting(false)
      return // Stop the submission immediately!
    }

    const payload = {
      shipping_address_line_1: formData.address,
      shipping_address_line_2: formData.addressLine2,
      shipping_city: formData.city,
      shipping_state: formData.state,
      shipping_pincode: formData.pincode,
      shipping_country: "India",
    }

    const idempotencyKey = crypto.randomUUID()

    try {
      const response = await api.post("/api/v1/orders/checkout", payload, {
        headers: {
          "Idempotency-Key": idempotencyKey,
        },
      })

      const newOrder = response.data
      try {
        await clearCart()
      } catch (clearError) {
        console.log("Cart already cleared by backend.")
      }

      // Hard redirect with the Order ID in the URL params
      window.location.href = `/success?order_id=${newOrder.id}`

    } catch (error: any) {
      console.error("Checkout failed:", error)

      const status = error.response?.status
      const detail = error.response?.data?.detail

      if (status === 422) {
        setErrorMessage("Please fill out all required shipping fields completely.")
      } else if (status === 400 || status === 409) {
        setErrorMessage(detail || "Payment failed or inventory unavailable.")
      } else {
        setErrorMessage("A network error occurred. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || cartItems.length === 0) {
    return null
  }

  return (
    <div className="bg-white">
      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            {/* Left Column - Shipping Form */}
            <div>
              <div className="mb-10 flex items-center gap-3">
                <Package className="h-4 w-4 text-zinc-400" strokeWidth={1} />
                <h2 className="text-xs font-medium tracking-[0.2em] text-zinc-900">
                  SHIPPING & DETAILS
                </h2>
              </div>

              <FieldGroup className="gap-6">
                {/* Name Row */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field>
                    <FieldLabel className="text-[10px] font-normal tracking-[0.15em] text-zinc-500 uppercase mb-2">
                      First Name
                    </FieldLabel>
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="h-12 rounded-none border-zinc-200 bg-zinc-50/50 text-sm focus-visible:border-zinc-900 focus-visible:ring-0"
                    />
                  </Field>
                  <Field>
                    <FieldLabel className="text-[10px] font-normal tracking-[0.15em] text-zinc-500 uppercase mb-2">
                      Last Name
                    </FieldLabel>
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="h-12 rounded-none border-zinc-200 bg-zinc-50/50 text-sm focus-visible:border-zinc-900 focus-visible:ring-0"
                    />
                  </Field>
                </div>

                {/* Email */}
                <Field>
                  <FieldLabel className="text-[10px] font-normal tracking-[0.15em] text-zinc-500 uppercase mb-2">
                    Email Address
                  </FieldLabel>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="h-12 rounded-none border-zinc-200 bg-zinc-50/50 text-sm focus-visible:border-zinc-900 focus-visible:ring-0"
                  />
                </Field>

                {/* Phone */}
                <Field>
                  <FieldLabel className="text-[10px] font-normal tracking-[0.15em] text-zinc-500 uppercase mb-2">
                    Phone Number
                  </FieldLabel>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91"
                    className="h-12 rounded-none border-zinc-200 bg-zinc-50/50 text-sm focus-visible:border-zinc-900 focus-visible:ring-0"
                  />
                </Field>

                <Separator className="my-2 bg-zinc-100" />

                {/* Address */}
                <Field>
                  <FieldLabel className="text-[10px] font-normal tracking-[0.15em] text-zinc-500 uppercase mb-2">
                    Address Line 1
                  </FieldLabel>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your shipping address"
                    className="h-12 rounded-none border-zinc-200 bg-zinc-50/50 text-sm focus-visible:border-zinc-900 focus-visible:ring-0"
                  />
                </Field>

                <Field>
                  <FieldLabel className="text-[10px] font-normal tracking-[0.15em] text-zinc-500 uppercase mb-2">
                    Address Line 2
                  </FieldLabel>
                  <Input
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    placeholder="Enter your shipping address"
                    className="h-12 rounded-none border-zinc-200 bg-zinc-50/50 text-sm focus-visible:border-zinc-900 focus-visible:ring-0"
                  />
                </Field>

                {/* City & State Row */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field>
                    <FieldLabel className="text-[10px] font-normal tracking-[0.15em] text-zinc-500 uppercase mb-2">
                      City
                    </FieldLabel>
                    <Input
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="h-12 rounded-none border-zinc-200 bg-zinc-50/50 text-sm focus-visible:border-zinc-900 focus-visible:ring-0"
                    />
                  </Field>
                  <Field>
                    <FieldLabel className="text-[10px] font-normal tracking-[0.15em] text-zinc-500 uppercase mb-2">
                      State
                    </FieldLabel>
                    <Input
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="h-12 rounded-none border-zinc-200 bg-zinc-50/50 text-sm focus-visible:border-zinc-900 focus-visible:ring-0"
                    />
                  </Field>
                </div>

                {/* Pincode */}
                <Field>
                  <FieldLabel className="text-[10px] font-normal tracking-[0.15em] text-zinc-500 uppercase mb-2">
                    Pincode
                  </FieldLabel>
                  <Input
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="360001"
                    className="h-12 rounded-none border-zinc-200 bg-zinc-50/50 text-sm focus-visible:border-zinc-900 focus-visible:ring-0"
                  />
                </Field>
              </FieldGroup>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:sticky lg:top-8 lg:self-start">
              <div className="border border-zinc-200 p-8">
                <div className="mb-8 flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-zinc-400" strokeWidth={1} />
                  <h2 className="text-xs font-medium tracking-[0.2em] text-zinc-900">
                    ORDER SUMMARY
                  </h2>
                </div>

                {/* Order Items */}
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-5">
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden bg-zinc-100">
                        <Image
                          src={item.image_urls?.[0] ?? "/placeholder.svg?height=160&width=160"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-center">
                        <h3 className="text-xs font-medium tracking-wide text-zinc-900">
                          {item.name}
                        </h3>

                        {/* UPDATED: Dynamic Attributes instead of hardcoded size/variant */}
                        <div className="mt-1 space-y-0.5">
                          {item.attributes && Object.entries(item.attributes).map(([key, value]) => (
                            <p key={key} className="text-[10px] tracking-wide text-zinc-500 uppercase">
                              {key}: {value as string}
                            </p>
                          ))}
                        </div>
                        <p className="mt-2 text-sm font-medium text-zinc-900">
                          {formatINR(normalizePrice(item.price) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-8 bg-zinc-200" />

                {/* Totals */}
                <div className="space-y-4">
                  <div className="flex justify-between text-xs text-zinc-600">
                    <span className="tracking-wide">Subtotal</span>
                    <span className="font-medium text-zinc-900">
                      {formatINR(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-600">
                    <span className="tracking-wide">Tax (GST)</span>
                    <span className="font-medium text-zinc-900">
                      {formatINR(tax_amount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-600">
                    <span className="tracking-wide">Shipping</span>
                    <span className="font-medium text-zinc-900">
                      {shipping_amount === 0 ? "FREE" : formatINR(shipping_amount)}
                    </span>
                  </div>
                  <Separator className="bg-zinc-200" />
                  <div className="flex justify-between text-sm">
                    <span className="font-medium tracking-wide text-zinc-900">
                      Total
                    </span>
                    <span className="font-semibold text-zinc-900">
                      {formatINR(grand_total)}
                    </span>
                  </div>
                </div>

                {errorMessage ? (
                  <p className="mt-6 text-sm text-red-600">{errorMessage}</p>
                ) : null}

                {/* Place Order Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-10 h-14 w-full rounded-none bg-zinc-900 text-xs font-medium tracking-[0.2em] text-white hover:bg-zinc-800"
                >
                  {isSubmitting ? "PROCESSING..." : "PLACE ORDER"}
                </Button>

                {/* Trust Badge */}
                <div className="mt-6 flex items-center justify-center gap-2 text-zinc-400">
                  <ShieldCheck className="h-4 w-4" strokeWidth={1} />
                  <span className="text-[10px] tracking-wide">
                    SECURE 256-BIT ENCRYPTED CHECKOUT
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
