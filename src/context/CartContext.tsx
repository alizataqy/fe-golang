"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext"; // Ambil user dari AuthContext

const API_URL = "http://localhost:3000/api/cart";

interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useAuth(); // Ambil user dari AuthContext

  useEffect(() => {
    if (user?.id) {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user?.id) return; // Jangan fetch kalau belum login

    const token = localStorage.getItem("token");
    if (!token) {
        console.error("❌ Token tidak ditemukan! Pengguna harus login.");
        return;
    }

    try {
        const response = await axios.get(`${API_URL}/${user.id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("✅ Cart berhasil di-fetch:", response.data);
        setCartItems(response.data.items || []);
    } catch (error) {
        console.error("❌ Error fetching cart:", error);
    }
};

  const addToCart = async (productId: number, quantity: number) => {
    if (typeof window === "undefined") return; // Hindari error di SSR

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ Tidak ada token! Silakan login.");
      alert("Silakan login terlebih dahulu!");
      return;
    }

    if (!user?.id) {
      console.error("❌ User ID tidak ditemukan! Pastikan pengguna sudah login.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/add`,
        {
          user_id: user.id, // Pastikan user.id tersedia
          product_id: productId,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Kirim token dengan benar
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Produk berhasil ditambahkan ke cart:", response.data);
      fetchCart();
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
    }
  };

  const removeFromCart = async (itemId: number) => {
    if (!user?.id) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ Token tidak ditemukan saat menghapus item!");
      return;
    }

    try {
      await axios.delete(`${API_URL}/item/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(`✅ Item ${itemId} berhasil dihapus dari cart.`);
      fetchCart();
    } catch (error) {
      console.error("❌ Error removing from cart:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, fetchCart, addToCart, removeFromCart }}>
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
