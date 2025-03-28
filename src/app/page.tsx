"use client";

import { useEffect, useState } from "react";
import { fetchProducts, Product } from "@/services/api";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Header from "@/components/Header";




export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart(); // Menggunakan useCart untuk menambah produk ke keranjang

  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };
    getProducts();
  }, []);

  return (
    <div>
      <Header />
      <h1 className="text-2xl font-bold mb-4">
        Produk
        </h1>
      <div className="grid grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded-lg shadow-sm hover:shadow-md transition">
            <Link href={`/products/${product.id}`}>
              <img src={product.file} alt={product.name} className="w-full h-40 object-cover rounded-md" />
            </Link>
            <div className="flex justify-between items-center mt-2">
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-blue-600 font-bold">Rp. {product.price}</p>
            </div>
            {/* Tombol Tambah ke Keranjang */}
            <button
              onClick={async () => {
                await addToCart(product.id, 1);
                alert(`${product.name} ditambahkan ke keranjang!`);
              }}
              className="mt-3 w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition"
            >
              Tambah ke Keranjang
            </button>


          </div>
        ))}
      </div>
    </div>
  );
}
