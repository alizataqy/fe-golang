"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const BASE_URL = "http://localhost:3000";
const API_URL = `${BASE_URL}/api/cart`;
const PRODUCT_URL = `${BASE_URL}/api/products`; 

interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

interface CartContextType {
  cartItems: CartItem[];
  products: Product[];
  fetchCart: () => Promise<void>;
  fetchProducts: () => Promise<void>;
  addToCart: (productId: number, quantity: number, productPrice: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  getProductById: (productId: number) => Product | undefined;
  getSubtotal: (productId: number, quantity: number) => number;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      fetchCart();
      fetchProducts(); // ambil data produk saat user login
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user?.id) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get(`${API_URL}/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCartItems(response.data.items || []);
    } catch (error) {
      console.error("❌ Error fetching cart:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(PRODUCT_URL);
      setProducts(res.data);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
    }
  };

  const addToCart = async (productId: number, quantity: number) => {
    const token = localStorage.getItem("token");
    if (!token || !user?.id) return;

    try {
      await axios.post(
        `${API_URL}/add`,
        {
          user_id: user.id,
          product_id: productId,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      fetchCart();
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
    }
  };

  const removeFromCart = async (itemId: number) => {
    const token = localStorage.getItem("token");
    if (!token || !user?.id) return;

    try {
      await axios.delete(`${API_URL}/item/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchCart();
    } catch (error) {
      console.error("❌ Error removing from cart:", error);
    }
  };

  const getProductById = (productId: number): Product | undefined => {
    return products.find((product) => product.id === productId);
  };

  const getSubtotal = (productId: number, quantity: number): number => {
    const product = getProductById(productId);
    return (product?.price || 0) * quantity;
  };

  const getCartTotal = (): number => {
    return cartItems.reduce((total, item) => {
      return total + getSubtotal(item.product_id, item.quantity);
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        products,
        fetchCart,
        fetchProducts,
        addToCart,
        removeFromCart,
        getProductById,
        getSubtotal,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
