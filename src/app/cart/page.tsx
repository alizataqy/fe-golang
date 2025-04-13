"use client";

import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    getProductById,
    getSubtotal,
    getCartTotal,
  } = useCart();

  return (
    <div className="max-w-2xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">Keranjang Belanja</h1>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => addToCart(2, 1)} // Tidak perlu kirim harga, diambil dari context
      >
        Tambah Produk ke Keranjang
      </button>

      {cartItems.length === 0 ? (
        <p>Keranjang kosong.</p>
      ) : (
        <>
          <ul className="space-y-2">
            {cartItems.map((item) => {
              const product = getProductById(item.product_id);
              const subtotal = getSubtotal(item.product_id, item.quantity);

              return (
                <li
                  key={item.id}
                  className="flex flex-col sm:flex-row justify-between p-3 border rounded"
                >
                  <span>
                    {product?.name || "Produk"} | Jumlah: {item.quantity} | Harga: Rp{" "}
                    {(product?.price || 0).toLocaleString()}
                  </span>
                  <div className="flex items-center justify-between gap-2 mt-2 sm:mt-0">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Hapus
                    </button>
                    <span>
                      Subtotal: Rp {subtotal.toLocaleString()}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
          <div>
            <div className="text-right mt-4 text-lg font-semibold">
              Total Harga: Rp {getCartTotal().toLocaleString()}
            </div>
            <button className="bg-green-500 text-white px-4 py-2 rounded mt-4">
              Checkout
            </button>
          </div>

        </>
      )}
    </div>
  );
}
