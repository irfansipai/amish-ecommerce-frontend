"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api } from "@/lib/api";

interface ApiCartItem {
  id: string;
  cart_id: string;
  product_id: string;
  name: string;
  price: string;
  quantity: number;
  image_url: string | null;
  size: string | null;
  variant: string | null;
}

interface CartResponse {
  items: ApiCartItem[];
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  name: string;
  price: number | string;
  quantity: number;
  image_url: string | null;
  size: string | null;
  variant: string | null;
}

export interface AddToCartItem {
  product_id: string;
  quantity: number;
  size: string | null;
  variant: string | null;
}

interface CartContextValue {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  isLoading: boolean;
  addToCart: (item: AddToCartItem) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const mapApiCartItem = (item: ApiCartItem): CartItem => ({
  ...item,
});

const parsePrice = (price: number | string) => {
  if (typeof price === "number") {
    return price;
  }

  const parsedPrice = Number.parseFloat(price);
  return Number.isNaN(parsedPrice) ? 0 : parsedPrice;
};

const fetchCartItems = async (): Promise<CartItem[]> => {
  const response = await api.get<CartResponse>("/api/v1/carts/");
  return response.data.items.map(mapApiCartItem);
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const syncCart = async () => {
    setIsLoading(true);

    try {
      const items = await fetchCartItems();
      setCartItems(items);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      setIsLoading(false);
      setCartItems([]);
      return;
    }

    syncCart();
  }, []);

  const addToCart = async (item: AddToCartItem) => {
    await api.post("/api/v1/carts/items", {
      product_id: item.product_id,
      quantity: item.quantity,
      size: item.size,
      variant: item.variant,
    });

    await syncCart();
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

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const cartTotal = cartItems.reduce(
    (total, item) => total + parsePrice(item.price) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
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
