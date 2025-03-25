// components/ProductCard.tsx
import { Product } from "@/services/api";
import Link from "next/link";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border p-4 rounded-lg shadow-md">
      <img src={product.file} alt={product.name} className="w-full h-40 object-cover rounded-md" />
      <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
      <p className="text-gray-700">Rp {product.price.toLocaleString("id-ID")}</p>
      <Link href={`/products/${product.id}`}>
        <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Detail</button>
      </Link>
    </div>
  );
}
