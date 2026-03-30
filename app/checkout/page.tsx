// frontend/app/checkout/page.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import { Package, CreditCard, ShieldCheck } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"

const orderItems = [
  {
    id: 1,
    name: "LEATHER MOTO JACKET",
    description: "Premium Italian Leather / Black",
    price: 189000,
    image: "/products/jacket.jpg",
  },
  {
    id: 2,
    name: "CHRONOGRAPH SILVER WATCH",
    description: "Swiss Movement / 42mm",
    price: 245000,
    image: "/products/watch.jpg",
  },
]

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    firstName: "Irfan",
    lastName: "Sipai",
    email: "ee.irfansmail@gmail.com",
    address: "",
    city: "Rajkot",
    state: "Gujarat",
    pincode: "",
    phone: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const subtotal = orderItems.reduce((acc, item) => acc + item.price, 0)
  const shipping = 0
  const total = subtotal + shipping

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Order placed:", { formData, orderItems, total })
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
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex gap-5">
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden bg-zinc-100">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-center">
                        <h3 className="text-xs font-medium tracking-wide text-zinc-900">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-[10px] tracking-wide text-zinc-500">
                          {item.description}
                        </p>
                        <p className="mt-2 text-sm font-medium text-zinc-900">
                          {formatINR(item.price)}
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
                    <span className="tracking-wide">Shipping</span>
                    <span className="font-medium text-zinc-900">
                      {shipping === 0 ? "FREE" : formatINR(shipping)}
                    </span>
                  </div>
                  <Separator className="bg-zinc-200" />
                  <div className="flex justify-between text-sm">
                    <span className="font-medium tracking-wide text-zinc-900">
                      Total
                    </span>
                    <span className="font-semibold text-zinc-900">
                      {formatINR(total)}
                    </span>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  type="submit"
                  className="mt-10 h-14 w-full rounded-none bg-zinc-900 text-xs font-medium tracking-[0.2em] text-white hover:bg-zinc-800"
                >
                  PLACE ORDER
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
