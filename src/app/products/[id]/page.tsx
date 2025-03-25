import { fetchProducts } from "@/services/api";

export default async function ProductDetail({ params }: { params: { id: string } }) {
  const products = await fetchProducts();
  const product = products.find((p) => p.id === parseInt(params.id));

  if (!product) return <p>Produk tidak ditemukan</p>;

  return (
    <main className="container mx-auto p-4">
      <div className="grid grid-cols-2 gap-4">
        <img src={product.file} alt={product.name} className="w-full h-60 object-cover rounded-md" />
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-gray-700">Rp {product.price.toLocaleString("id-ID")}</p>
          <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded">Tambah ke Keranjang</button>
        </div>
      </div>
    </main>
  );
}
