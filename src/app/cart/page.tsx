"use client";

import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cartItems, addToCart, removeFromCart } = useCart();

  return (
    <div className="max-w-2xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">Keranjang Belanja</h1>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => addToCart(2, 1)} // Ubah product_id sesuai kebutuhan
      >
        Tambah Produk ke Keranjang
      </button>

      {cartItems.length === 0 ? (
        <p>Keranjang kosong.</p>
      ) : (
        <ul className="space-y-2">
          {cartItems.map((item) => (
            <li key={item.id} className="flex justify-between p-3 border rounded">
              <span>Produk ID: {item.product_id} | Jumlah: {item.quantity}</span>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => removeFromCart(item.id)}
              >
                Hapus
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
