"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { api } from "@/lib/api"
import { ShoppingBag, ArrowRight } from "lucide-react"


interface OrderItem {
  id: string
  name: string
  quantity: number
  price_at_purchase: string
}

interface Order {
  id: string
  status: string
  total_amount: string
  tax_amount: string
  shipping_amount: string
  created_at: string
  items: OrderItem[]
}

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount)
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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get<Order[]>("/api/v1/orders/")
        setOrders(response.data)
      } catch (err: any) {
        setError("Failed to load order history")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-zinc-500 tracking-wider">LOADING...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-red-600 tracking-wider">{error}</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <ShoppingBag className="size-16 text-zinc-300 mb-6" />
        <h2 className="text-xl font-light tracking-[0.15em] text-zinc-900 mb-3">
          NO ORDERS YET
        </h2>
        <p className="text-sm text-zinc-500 mb-8">
          You haven't placed any orders yet.
        </p>
        <Link
          href="/catalog"
          className="flex items-center gap-2 bg-zinc-900 text-white px-8 py-3 text-xs font-medium tracking-[0.2em] hover:bg-zinc-800 transition-colors"
        >
          EXPLORE COLLECTION
          <ArrowRight className="size-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-light tracking-[0.2em] text-zinc-900 mb-10">
        ORDER HISTORY
      </h1>

      <div className="space-y-4">
        {orders.map((order) => {
          // Totals are provided by the backend — no local math
          const grandTotal = parseFloat(order.total_amount) || 0

          return (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="block border border-zinc-200 p-6 hover:border-zinc-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Order Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold tracking-[0.15em] text-zinc-500 uppercase">
                      Order
                    </span>
                    <span className="text-sm font-mono text-zinc-900">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold tracking-[0.15em] text-zinc-500 uppercase">
                      Date
                    </span>
                    <span className="text-sm text-zinc-600">
                      {new Date(order.created_at).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Status & Amount */}
                <div className="flex items-center gap-6">
                  <span
                    className={`inline-flex items-center px-3 py-1 text-[10px] font-bold tracking-[0.15em] ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                  <div className="text-right">
                    <p className="text-[10px] font-bold tracking-[0.15em] text-zinc-500 uppercase">
                      Total
                    </p>
                    <p className="text-lg font-medium text-zinc-900">
                      {formatINR(grandTotal)}
                    </p>
                    <p className="text-[10px] text-zinc-500">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}