"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

const Header: React.FC = () => {
  const { user, logoutUser } = useAuth()!;
  const { cartItems } =  useCart();

  return (
    <header className="bg-blue-500 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link href="/">
          <span className="text-xl font-bold cursor-pointer">UCUPSTORE</span>
        </Link>

        <nav>
          <ul className="flex space-x-6">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            
          </ul>
        </nav>

        <div className="flex items-center space-x-4">
        <Link href="/cart" className="px-4 py-2 bg-blue-500 rounded">
          Cart ({cartItems?.length || 0})
        </Link>

          {user ? (
            <>
              <span className="font-medium">{user?.username}</span>
              <button onClick={logoutUser} className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-700">Logout</button>
            </>
          ) : (
            <Link href="/login" className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
