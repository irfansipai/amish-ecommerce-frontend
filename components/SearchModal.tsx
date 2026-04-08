// frontend/components/SearchModal.tsx
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { api } from "@/lib/api"
import Link from "next/link"
import Image from "next/image"

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)
        return () => clearTimeout(handler)
    }, [value, delay])
    return debouncedValue
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price)
}

interface SearchModalProps {
    isOpen: boolean
    onClose: () => void
}

interface Product {
    id: string
    name: string
    price: number
    image_urls: string[]
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [results, setResults] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const debouncedSearchTerm = useDebounce(searchTerm, 500)

    useEffect(() => {
        if (!isOpen) {
            setSearchTerm("")
            setResults([])
            return
        }
    }, [isOpen])

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!debouncedSearchTerm) {
                setResults([])
                return
            }

            try {
                setIsLoading(true)
                const response = await api.get(`/api/v1/products?q=${encodeURIComponent(debouncedSearchTerm)}`)
                setResults(response.data)
            } catch (error) {
                console.error("Failed to search products", error)
                setResults([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchSearchResults()
    }, [debouncedSearchTerm])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[80] bg-white pointer-events-auto overflow-y-auto">
        <div className="relative flex justify-between items-center w-full px-6 lg:px-12 py-6">
            {/* Left Spacer */}
            <div className="flex-1"></div>

            {/* Center Logo (Perfectly Centered) */}
            <div className="absolute left-1/2 -translate-x-1/2">
                <h1 className="font-serif text-2xl md:text-3xl font-light tracking-[0.3em] text-black">
                    MAISON
                </h1>
            </div>

            {/* Right Close Button */}
            <div className="flex-1 flex justify-end">
                <button
                    onClick={onClose}
                    className="flex items-center gap-2 cursor-pointer uppercase text-sm tracking-widest text-black hover:text-neutral-500 transition-colors"
                    aria-label="Close Search"
                >
                    <span className="hidden md:inline">Close</span>
                    <X className="w-8 h-8 font-light" strokeWidth={1} />
                </button>
            </div>
        </div>

            <div className="mt-16 md:mt-32 max-w-2xl mx-auto px-6 w-full">
            <div className="relative flex items-center w-full">
                <input
                    autoFocus
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for: Handbags, Jackets..."
                    className="w-full bg-transparent text-xl md:text-2xl font-light font-serif tracking-wide border-b border-black pb-3 pr-10 focus:outline-none focus:border-black transition-colors"
                />
                {searchTerm && (
                    <button
                        type="button"
                        onClick={() => setSearchTerm("")}
                        className="absolute right-0 bottom-3 text-neutral-400 hover:text-black transition-colors"
                        aria-label="Clear search"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

                <div className="mt-12">
                    {isLoading ? (
                        <div className="text-center py-20">
                            <p className="text-sm tracking-[0.2em] uppercase text-neutral-400 animate-pulse">Loading...</p>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
                            {results.map((product) => (
                                <Link key={product.id} href={`/product/${product.id}`} onClick={onClose} className="group">
                                    <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 mb-4">
                                        <Image
                                            src={product.image_urls?.[0] || "/placeholder.svg?height=800&width=600"}
                                            alt={product.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                        />
                                    </div>
                                    <h3 className="text-xs font-normal tracking-wide text-black mb-1 line-clamp-1">{product.name}</h3>
                                    <p className="text-xs text-neutral-500">{formatPrice(product.price)}</p>
                                </Link>
                            ))}
                        </div>
                    ) : debouncedSearchTerm ? (
                        <div className="text-center py-20">
                            <p className="text-sm tracking-[0.2em] uppercase text-neutral-400">No Results Found.</p>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    )
}