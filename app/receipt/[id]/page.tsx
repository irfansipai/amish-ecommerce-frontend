"use client"

import { Suspense, useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Image from "next/image"
import axios from "axios"
import { toast } from "sonner"
import { Package, MapPin, CreditCard, Download } from "lucide-react"



interface OrderItem {
    id: string
    product_id: string
    quantity: number
    price_at_purchase: string
    name?: string
    image_url?: string | null
}

interface GuestOrder {
    id: string
    status: string
    subtotal: string
    total_amount: string
    tax_amount: string
    shipping_amount: string
    base_currency: string
    created_at: string
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

function GuestReceiptContent() {
    const params = useParams()
    const searchParams = useSearchParams()
    const orderId = params.id as string
    const token = searchParams.get("token")

    const [order, setOrder] = useState<GuestOrder | null>(null)
    const [enrichedItems, setEnrichedItems] = useState<OrderItem[]>([])
    const [loading, setLoading] = useState(true)
    const [isDownloading, setIsDownloading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (!orderId || !token) {
            setError("Invalid receipt link.")
            setLoading(false)
            return
        }

        const fetchReceipt = async () => {
            try {
                const url = `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/orders/${orderId}/guest_receipt?token=${token}`
                const response = await axios.get<GuestOrder>(url)
                setOrder(response.data)

                // Attempting to enrich items gracefully (bypassing custom api to avoid redirect)
                const itemsWithDetails = await Promise.all(
                    response.data.items.map(async (item) => {
                        try {
                            const productUrl = `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/products/${item.product_id}`
                            const prodRes = await axios.get(productUrl)
                            return {
                                ...item,
                                name: prodRes.data.name,
                                image_url: prodRes.data.image_url,
                            }
                        } catch {
                            return {
                                ...item,
                                name: "Product Item",
                                image_url: null,
                            }
                        }
                    })
                )
                setEnrichedItems(itemsWithDetails)

            } catch (err: any) {
                setError(err.response?.data?.detail || "Failed to load receipt details.")
            } finally {
                setLoading(false)
            }
        }

        fetchReceipt()
    }, [orderId, token])

    const handleDownloadInvoice = async () => {
        if (!order) return
        setIsDownloading(true)
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/orders/${order.id}/guest_invoice?token=${token}`,
                { responseType: "blob" }
            )
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement("a")
            link.href = url
            const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || "MAISON"
            link.setAttribute("download", `invoice_${companyName}_${order.id}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
            toast.success("Invoice downloaded successfully.")
        } catch (err) {
            toast.error("Failed to download invoice.")
        } finally {
            setIsDownloading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center bg-white">
                <p className="text-sm text-zinc-500 tracking-[0.2em] uppercase">Loading Receipt...</p>
            </div>
        )
    }

    if (error || !order) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white space-y-4">
                <p className="text-sm text-red-600 tracking-[0.1em] uppercase">{error}</p>
                <p className="text-xs text-zinc-500">Please make sure you have the correct and valid link.</p>
            </div>
        )
    }

    // Totals come directly from the backend — no local math
    const subtotal = order.subtotal

    const displayItems = enrichedItems.length > 0 ? enrichedItems : order.items

    return (
        <div className="min-h-screen bg-white pt-24 pb-12 px-6 sm:px-12">
            <div className="max-w-3xl mx-auto space-y-12">
                {/* Header / Ty Message */}
                <div className="text-center space-y-6">
                    <div className="mx-auto w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
                        <span className="text-white text-xl font-serif font-light">L</span>
                    </div>
                    <h1 className="text-3xl font-light tracking-[0.2em] text-zinc-900 uppercase">
                        Order Confirmed
                    </h1>
                    <p className="text-sm text-zinc-500 font-mono tracking-wide">
                        ORDER #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                </div>

                {/* Status Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between border-t border-b border-zinc-200 py-6 gap-6">
                    <div className="flex flex-col items-center sm:items-start gap-2">
                        <span className="text-[10px] uppercase tracking-widest text-zinc-500">
                            Current Status
                        </span>
                        <span
                            className={`inline-flex items-center px-4 py-2 text-xs font-bold tracking-[0.15em] ${getStatusColor(
                                order.status
                            )}`}
                        >
                            {order.status}
                        </span>
                    </div>
                    <button
                        onClick={handleDownloadInvoice}
                        disabled={isDownloading}
                        className="flex items-center gap-2 px-8 py-3 text-xs font-bold tracking-[0.15em] bg-zinc-900 text-white hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase"
                    >
                        <Download className="w-4 h-4" />
                        {isDownloading ? "DOWNLOADING..." : "DOWNLOAD OFFICIAL INVOICE"}
                    </button>
                </div>

                <div className="grid gap-12 md:grid-cols-2">
                    {/* Items */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-zinc-200 pb-4">
                            <Package className="h-4 w-4 text-zinc-400" strokeWidth={1} />
                            <h2 className="text-xs font-medium tracking-[0.2em] text-zinc-900">
                                PURCHASED ITEMS
                            </h2>
                        </div>

                        <div className="space-y-6">
                            {displayItems.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="relative h-20 w-20 flex-shrink-0 bg-zinc-100">
                                        <Image
                                            src={item.image_url || "/placeholder.svg?height=160&width=160"}
                                            alt={item.name || "Product"}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col justify-center">
                                        <p className="text-sm font-medium text-zinc-900 truncate">
                                            {item.name}
                                        </p>
                                        <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">
                                            Qty: {item.quantity}
                                        </p>
                                        <p className="text-sm font-medium text-zinc-900 mt-2">
                                            {formatINR(parseFloat(item.price_at_purchase) * item.quantity)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Logistics & Cost */}
                    <div className="space-y-10">
                        {/* Shipping */}
                        <div className="bg-zinc-50 p-6 border border-zinc-100">
                            <div className="flex items-center gap-3 mb-4">
                                <MapPin className="h-4 w-4 text-zinc-400" strokeWidth={1} />
                                <h2 className="text-xs font-medium tracking-[0.2em] text-zinc-900">
                                    SHIPPING DETAILS
                                </h2>
                            </div>
                            <div className="text-sm text-zinc-600 space-y-1">
                                <p>{order.shipping_address_line_1}</p>
                                {order.shipping_address_line_2 && <p>{order.shipping_address_line_2}</p>}
                                <p>
                                    {order.shipping_city}, {order.shipping_state} {order.shipping_pincode}
                                </p>
                                <p className="uppercase mt-2">{order.shipping_country}</p>
                            </div>
                        </div>

                        {/* Breakdown */}
                        <div className="bg-zinc-50 p-6 border border-zinc-100">
                            <div className="flex items-center gap-3 mb-4">
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
                                    <span className="tracking-wide">Tax (GST)</span>
                                    <span className="font-medium text-zinc-900">
                                        {formatINR(order.tax_amount)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs text-zinc-600">
                                    <span className="tracking-wide">Shipping</span>
                                    <span className="font-medium text-zinc-900">
                                        {formatINR(order.shipping_amount)}
                                    </span>
                                </div>
                                <div className="border-t border-zinc-200 pt-4 mt-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium tracking-wide text-zinc-900">Grand Total</span>
                                        <span className="font-semibold text-zinc-900">
                                            {formatINR(order.total_amount)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function GuestReceiptPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex justify-center items-center">
                <p className="text-sm text-zinc-500 tracking-[0.2em] uppercase">Loading Receipt Context...</p>
            </div>
        }>
            <GuestReceiptContent />
        </Suspense>
    )
}
