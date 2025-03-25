"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, logoutUser } = useAuth()!;
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login"); // Redirect ke login jika belum login
    }
  }, [user, router]);

  if (!user) return null; // Hindari tampilan berkedip saat redirect

  return (
    <div className="max-w-lg mx-auto mt-10 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <p>Selamat datang, {user.username}!</p>
      <button onClick={logoutUser} className="bg-red-500 text-white px-4 py-2 mt-4">
        Logout
      </button>
    </div>
  );
}
