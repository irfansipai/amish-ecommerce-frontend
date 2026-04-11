// app/account/orders/[id]/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { api } from "@/lib/api"
import { TAX_RATE, SHIPPING_CHARGE } from "@/lib/constants"
import { ArrowLeft, Package, MapPin, CreditCard } from "lucide-react"
import { toast } from "sonner"

interface OrderItem {
  id: string
  product_id: string
  quantity: number
  price_at_purchase: string
}

interface ProductData {
  id: string
  name: string
  image_urls: string[]
}

interface EnrichedOrderItem extends OrderItem {
  name: string
  image_urls: string[]
}

interface Order {
  id: string
  status: string
  total_amount: string
  tax_amount: string
  shipping_amount: string
  base_currency: string
  created_at: string
  updated_at: string | null
  shipping_address_line_1: string
  shipping_address_line_2: string | null
  shipping_city: string
  shipping_state: string
  shipping_pincode: string
  shipping_country: string
  items: OrderItem[]
}

function formatINR(amount: string | number) {
  const num = typeof amount === "string" ? parseFloat(amount) : amount
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(num)
}

function getStatusColor(status: string) {
  switch (status.toUpperCase()) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800"
    case "PAID":
      return "bg-green-100 text-green-800"
    case "SHIPPED":
      return "bg-blue-100 text-blue-800"
    case "DELIVERED":
      return "bg-zinc-100 text-zinc-800"
    case "CANCELLED":
      return "bg-red-100 text-red-800"
    default:
      return "bg-zinc-100 text-zinc-600"
  }
}

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [enrichedItems, setEnrichedItems] = useState<EnrichedOrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isEnrichingItems, setIsEnrichingItems] = useState(false)
  const [error, setError] = useState("")
  const [cancelling, setCancelling] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get<Order[]>("/api/v1/orders/")
        const found = response.data.find((o) => o.id === orderId)
        if (!found) {
          setError("Order not found")
        } else {
          setOrder(found)
        }
      } catch (err: any) {
        setError("Failed to load order details")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  useEffect(() => {
    if (!order) return

    const enrichItems = async () => {
      setIsEnrichingItems(true)
      try {
        const enriched = await Promise.all(
          order.items.map(async (item) => {
            try {
              const productRes = await api.get<ProductData>(`/api/v1/products/${item.product_id}`)
              return {
                ...item,
                name: productRes.data.name,
                image_url: productRes.data.image_url,
              }
            } catch (err: any) {
              console.warn(`Failed to fetch product ${item.product_id}:`, err)
              return {
                ...item,
                name: "Unknown Product",
                image_url: null,
              }
            }
          })
        )
        setEnrichedItems(enriched)
      } catch (error) {
        console.error("Unexpected error during enrichment:", error)
        setIsEnrichingItems(false)
      } finally {
        setIsEnrichingItems(false)
      }
    }

    enrichItems()
  }, [order])

  const handleDownload = async () => {
    if (!order) return;
    setIsDownloading(true);
    try {
      const response = await api.get(`/api/v1/orders/${order.id}/invoice`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || "MAISON";
      link.setAttribute('download', `invoice_${companyName}_${order.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download invoice.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return
    setCancelling(true)
    try {
      await api.patch(`/api/v1/orders/${order.id}/status`, {
        status: "CANCELLED",
      })
      setOrder({ ...order, status: "CANCELLED" })
    } catch (err: any) {
      console.error("Failed to cancel order:", err)
      setError("Failed to cancel order. Please try again.")
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-zinc-500 tracking-wider">LOADING...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-red-600 tracking-wider">{error || "Order not found"}</p>
      </div>
    )
  }

  const canCancel =
    order.status.toUpperCase() === "PENDING" || order.status.toUpperCase() === "PAID"

  const subtotal = order.items.reduce(
    (sum, item) => sum + parseFloat(item.price_at_purchase) * item.quantity,
    0
  )

  const gstAmount = subtotal * TAX_RATE
  const shippingAmount = parseFloat(order.shipping_amount) || SHIPPING_CHARGE
  const grandTotal = subtotal + gstAmount + shippingAmount

  const displayItems = enrichedItems.length > 0 ? enrichedItems : order.items.map(item => ({
    ...item,
    name: "Loading...",
    image_url: null,
  }))

  return (
    <div className="max-w-4xl">
      {/* Back Button */}
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors mb-8"
      >
        <ArrowLeft className="size-4" />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-light tracking-[0.2em] text-zinc-900">
            ORDER DETAILS
          </h1>
          <p className="text-sm text-zinc-500 mt-1 font-mono">
            #{order.id.slice(0, 8).toUpperCase()}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span
            className={`inline-flex items-center px-4 py-2 text-xs font-bold tracking-[0.15em] ${getStatusColor(order.status)}`}
          >
            {order.status}
          </span>
          {canCancel && (
            <button
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="px-6 py-2 text-xs font-bold tracking-[0.15em] bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelling ? "CANCELLING..." : "CANCEL ORDER"}
            </button>
          )}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-6 py-2 text-xs font-bold tracking-[0.15em] border border-zinc-200 text-zinc-900 hover:bg-zinc-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase"
          >
            {isDownloading ? "DOWNLOADING..." : "DOWNLOAD INVOICE"}
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column - Items & Shipping */}
        <div className="space-y-8">
          {/* Items List */}
          <div className="border border-zinc-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Package className="h-4 w-4 text-zinc-400" strokeWidth={1} />
              <h2 className="text-xs font-medium tracking-[0.2em] text-zinc-900">
                ITEMS
              </h2>
            </div>
            {isEnrichingItems ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-zinc-500 tracking-wider">LOADING PRODUCTS...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {displayItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`/product/${item.product_id}`}
                    className="flex gap-4 group"
                  >
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden bg-zinc-100">
                      <Image
                        src={item.image_url || "/placeholder.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:opacity-75 transition-opacity"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-zinc-900 group-hover:underline">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-1">
                        Qty: {item.quantity} × {formatINR(item.price_at_purchase)}
                      </p>
                      <p className="text-sm font-medium text-zinc-900 mt-1">
                        {formatINR(parseFloat(item.price_at_purchase) * item.quantity)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Shipping Address */}
          <div className="border border-zinc-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="h-4 w-4 text-zinc-400" strokeWidth={1} />
              <h2 className="text-xs font-medium tracking-[0.2em] text-zinc-900">
                SHIPPING ADDRESS
              </h2>
            </div>
            <div className="text-sm text-zinc-600 space-y-1">
              <p>{order.shipping_address_line_1}</p>
              {order.shipping_address_line_2 && <p>{order.shipping_address_line_2}</p>}
              <p>
                {order.shipping_city}, {order.shipping_state} {order.shipping_pincode}
              </p>
              <p>{order.shipping_country}</p>
            </div>
          </div>
        </div>

        {/* Right Column - Cost Breakdown */}
        <div>
          <div className="border border-zinc-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="h-4 w-4 text-zinc-400" strokeWidth={1} />
              <h2 className="text-xs font-medium tracking-[0.2em] text-zinc-900">
                COST BREAKDOWN
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-xs text-zinc-600">
                <span className="tracking-wide">Subtotal</span>
                <span className="font-medium text-zinc-900">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-zinc-600">
                <span className="tracking-wide">GST ({TAX_RATE * 100}%)</span>
                <span className="font-medium text-zinc-900">
                  {formatINR(gstAmount)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-zinc-600">
                <span className="tracking-wide">Shipping</span>
                <span className="font-medium text-zinc-900">
                  {formatINR(order.shipping_amount)}
                </span>
              </div>
              <div className="border-t border-zinc-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="font-medium tracking-wide text-zinc-900">Grand Total</span>
                  <span className="font-semibold text-zinc-900">
                    {formatINR(grandTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Meta */}
          <div className="border border-zinc-200 p-6 mt-8">
            <h2 className="text-xs font-medium tracking-[0.2em] text-zinc-900 mb-4">
              ORDER INFO
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Order Date</span>
                <span className="text-zinc-900">
                  {new Date(order.created_at).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Currency</span>
                <span className="text-zinc-900">{order.base_currency}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}