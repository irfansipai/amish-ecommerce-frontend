// context/CartContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface ApiCartItem {
  id: string;
  cart_id: string;
  product_id: string;
  name: string;
  price: string;
  quantity: number;
  image_urls: string[];
  size: string | null;
  variant: string | null;
}

export interface CartSummary {
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  grand_total: number;
}

interface CartResponse {
  items: ApiCartItem[];
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  grand_total: number;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  name: string;
  price: number | string;
  quantity: number;
  image_urls: string[];
  size: string | null;
  variant: string | null;
}

export interface AddToCartItem {
  product_id: string;
  quantity: number;
  size: string | null;
  variant: string | null;
}

const DEFAULT_SUMMARY: CartSummary = {
  subtotal: 0,
  tax_amount: 0,
  shipping_amount: 0,
  discount_amount: 0,
  grand_total: 0,
};

interface CartContextValue {
  cartItems: CartItem[];
  cartSummary: CartSummary;
  cartCount: number;
  /** @deprecated Use cartSummary.grand_total instead */
  cartTotal: number;
  isLoading: boolean;
  addToCart: (item: AddToCartItem) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const mapApiCartItem = (item: ApiCartItem): CartItem => ({ ...item });

const fetchCart = async (): Promise<{ items: CartItem[]; summary: CartSummary }> => {
  const response = await api.get<CartResponse>("/api/v1/carts/");
  const { items, subtotal, tax_amount, shipping_amount, discount_amount, grand_total } =
    response.data;
  return {
    items: items.map(mapApiCartItem),
    summary: { subtotal, tax_amount, shipping_amount, discount_amount, grand_total },
  };
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartSummary, setCartSummary] = useState<CartSummary>(DEFAULT_SUMMARY);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();

  const syncCart = async () => {
    setIsLoading(true);
    try {
      const { items, summary } = await fetchCart();
      setCartItems(items);
      setCartSummary(summary);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCartItems([]);
      setCartSummary(DEFAULT_SUMMARY);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token || !user) {
      setIsLoading(false);
      setCartItems([]);
      setCartSummary(DEFAULT_SUMMARY);
      return;
    }

    syncCart();
  }, [user]);

  const addToCart = async (item: AddToCartItem) => {
    if (!localStorage.getItem("token") || !user) {
      console.warn("Attempted to add to cart without authentication.");
      return;
    }

    try {
      await api.post("/api/v1/carts/items", {
        product_id: item.product_id,
        quantity: item.quantity,
        size: item.size,
        variant: item.variant,
      });

      await syncCart();
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.warn("Authentication required to add item to cart.");
        return;
      }
      console.error("Failed to add item to cart:", error);
    }
  };

  const removeFromCart = async (id: string) => {
    await api.delete(`/api/v1/carts/items/${id}`);
    await syncCart();
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(id);
      return;
    }

    await api.patch(`/api/v1/carts/items/${id}`, { quantity });
    await syncCart();
  };

  const clearCart = async () => {
    await Promise.all(
      cartItems.map((item) => api.delete(`/api/v1/carts/items/${item.id}`))
    );

    await syncCart();
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartSummary,
        cartCount,
        cartTotal: cartSummary.grand_total,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
