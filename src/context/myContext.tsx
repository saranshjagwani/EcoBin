import React, { createContext } from "react";
import { Timestamp } from "firebase/firestore";

// Define types for product and product list
interface Product {
  title: string;
  price: string;
  imageUrl: string;
  category: string;
  description: string;
  time: Timestamp;
  date: string;
}

// Update MyContextType to include necessary properties
interface MyContextType {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  products: Product;
  setProducts: React.Dispatch<React.SetStateAction<Product>>;
  addProduct: () => Promise<void>;
  productList: Product[];
}

const myContext = createContext<MyContextType | null>(null);

export default myContext;
