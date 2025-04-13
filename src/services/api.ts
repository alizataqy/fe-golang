import axios from "axios";
import { jwtDecode } from "jwt-decode";

export interface Product {
  id: number;
  name: string;
  price: number;
  file: string;
  store_id: number;
  product_type_id: number;
}

export interface ProductType {
  id: number;
  name: string;
}

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: number;
  user_id: number;
  items: CartItem[];
}

const BASE_URL = "http://localhost:3000"; // Ganti dengan URL backend Golang

interface LoginResponse {
  token: string;
}

interface DecodedToken {
  user_id: number;
  username: string;
  exp: number;
}


export const saveToken = (token: string) => {
  localStorage.setItem("token", token);
};


export const getToken = () => {
  const token = localStorage.getItem("token");
  console.log("Token yang diambil dari localStorage:", token); 
  return token;
};

export const logout = () => {
  localStorage.removeItem("token");
};


export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.exp * 1000 > Date.now(); 
  } 
  catch (error) {
    return false;
  }
};

// **🔹 Register**
export const register = async (username: string, email: string, password: string) => {
  return axios.post(`${BASE_URL}/register`, { username, email, password });
};

// **🔹 Login**
export const login = async (username: string, password: string) => {
  const response = await axios.post<LoginResponse>(`${BASE_URL}/login`, {
    username,
    password,
  });

  console.log("Respons login:", response.data); 

  if (!response.data || !response.data.token) {
    throw new Error("Token tidak ditemukan dalam respons login");
  }

  saveToken(response.data.token); 
  return response.data.token; 
};


export async function fetchProductTypes(): Promise<ProductType[]> {
  const res = await fetch(`${BASE_URL}/api/producttypes`);
  if (!res.ok) throw new Error("Gagal mengambil data tipe produk");
  return res.json();
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/api/products`);
  if (!res.ok) throw new Error("Gagal mengambil data produk");
  return res.json();
}


export async function fetchProductById(id: number): Promise<Product> {
  const res = await fetch(`${BASE_URL}/api/products/${id}`);
  if (!res.ok) throw new Error("Gagal mengambil detail produk");
  return res.json();
}


export const addToCart = async (productId: number, quantity: number) => {
  const token = getToken();
  if (!token) throw new Error("User belum login");

  const res = await axios.post(
    `${BASE_URL}/api/cart`,
    { product_id: productId, quantity },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};


export const fetchCart = async (): Promise<Cart> => {
  const token = getToken();
  if (!token) throw new Error("User belum login");

  console.log("Mengambil cart dengan token:", token); 

  const res = await axios.get(`${BASE_URL}/api/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};


export const removeFromCart = async (productId: number) => {
  const token = getToken();
  if (!token) throw new Error("User belum login");

  const res = await axios.delete(`${BASE_URL}/api/cart/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};
