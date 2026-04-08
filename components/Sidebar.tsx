// frontend/components/Sidebar.tsx
import { useState, useEffect } from "react"
import { X, ChevronRight } from "lucide-react"
import { api } from "@/lib/api"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

interface SidebarProps {
    isOpen: boolean
    onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const [categories, setCategories] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { user } = useAuth()
    const router = useRouter()

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoading(true)
                const response = await api.get("/api/v1/categories/")
                setCategories(response.data.map((cat:any) => cat.name))
            } catch (error) {
                console.error("Failed to fetch categories", error)
                // Fallback just in case
                setCategories(["Women", "Handbags", "Clothing", "Shoes", "Accessories"])
            } finally {
                setIsLoading(false)
            }
        }

        if (isOpen && categories.length === 0) {
            fetchCategories()
        }
    }, [isOpen, categories.length])

    return (
        <>
            <div
                className={`fixed inset-0 z-[60] bg-black transition-opacity duration-300 ${isOpen ? "opacity-50 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={onClose}
            />

            <div
                className={`fixed top-0 right-0 z-[70] h-full w-full max-w-sm bg-white overflow-y-auto transform transition-transform duration-500 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex justify-end p-6">
                    <button onClick={onClose} className="hover:opacity-50 transition-opacity">
                        <X className="w-8 h-8 text-black font-light" strokeWidth={1} />
                    </button>
                </div>

                <div className="px-10 py-6 pb-32">
                    <ul className="space-y-0">
                        {categories.map((c) => (
                            <li key={c}>
                                <Link
                                    href={`/catalog?category=${c}`}
                                    onClick={onClose}
                                    className="flex justify-between items-center w-full py-5 border-b border-neutral-100 group transition-all hover:translate-x-1"
                                >
                                    <span className="text-sm md:text-base tracking-[0.1em] uppercase text-black group-hover:text-neutral-500 transition-colors">
                                        {c}
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-black group-hover:text-neutral-500 transition-colors" strokeWidth={1} />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-10 border-t border-neutral-100 bg-white">
                    <ul className="space-y-5">
                        <li>
                            <Link href="/account" onClick={onClose} className="text-sm tracking-widest uppercase hover:text-neutral-500 transition-colors">
                                {user ? "My Account" : "Sign In"}
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href={user ? "/account/orders" : "/auth"} 
                                onClick={onClose} 
                                className="text-sm tracking-widest uppercase hover:text-neutral-500 transition-colors"
                            >
                                Orders
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href={user ? "/wishlist" : "/auth"} 
                                onClick={onClose} 
                                className="text-sm tracking-widest uppercase hover:text-neutral-500 transition-colors"
                            >
                                Wishlist
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}