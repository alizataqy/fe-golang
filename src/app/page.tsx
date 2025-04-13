"use client";

import { useEffect, useState } from "react";
import {
  fetchProducts,
  Product,
  fetchProductTypes,
  ProductType,
} from "@/services/api";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };

    const getCategories = async () => {
      const data = await fetchProductTypes();
      setCategories(data);
    };

    getProducts();
    getCategories();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.product_type_id === selectedCategory)
    : products;

  return (
    <div>
      <Header />

      <h1 className="text-2xl text-center mt-4 font-bold">Produk</h1>

      {/* Tombol Kategori */}
      <div className="flex flex-wrap justify-center gap-2 my-6 px-4">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full border ${
            selectedCategory === null
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600 hover:bg-blue-100"
          }`}
        >
          Semua
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full border ${
              selectedCategory === cat.id
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600 hover:bg-blue-100"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="border p-4 rounded-lg shadow-sm hover:shadow-md transition"
          >
            <Link href={`/products/${product.id}`}>
              <div className="flex justify-center items-center mb-2">
                <Image
                  src={product.file}
                  alt={product.name}
                  width={600}
                  height={400}
                  className="object-cover rounded-md"
                />
              </div>
            </Link>

            <div className="flex justify-between items-center mt-2">
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-blue-600 font-bold">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(product.price)}
              </p>
            </div>

            {user ? (
              <button
                onClick={async () => {
                  await addToCart(product.id, 1, product.price || 0);
                  alert(`${product.name} ditambahkan ke keranjang!`);
                }}
                className="mt-3 w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition"
              >
                Tambah ke Keranjang
              </button>
            ) : (
              <Link href="/login">
                <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition">
                  Tambah ke Keranjang
                </button>
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Footer />
      </div>
    </div>
  );
}
