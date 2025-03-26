import React, { useEffect, useState } from "react";
import MyContext from "./myContext";
import { fireDB } from "@/firebase/FirebaseConfig";
import { Timestamp, addDoc, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { toast } from "react-toastify";

const MyState: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false); // For global loading state
  const [products, setProducts] = useState({
    title: "",
    price: "",
    imageUrl: "",
    category: "",
    description: "",
    time: Timestamp.now(),
    date: new Date().toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
  });

  const [productList, setProductList] = useState([]); // Stores all products from Firestore

  // ********************** Add Product Section  **********************
  const addProduct = async () => {
    // Validate fields before adding
    const { title, price, imageUrl, category, description } = products;
    if (!title || !price || !imageUrl || !category || !description) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const productRef = collection(fireDB, "products");
      await addDoc(productRef, products); // Add the product to Firestore
      toast.success("Product added successfully");
      setProducts({
        title: "",
        price: "",
        imageUrl: "",
        category: "",
        description: "",
        time: Timestamp.now(),
        date: new Date().toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
      }); // Reset product form
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  // ****** Get products from Firestore ******
  const getProductData = () => {
    setLoading(true);
    const q = query(
      collection(fireDB, "products"),
      orderBy("time", "desc") // Retrieve products in descending order
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const productsArray = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setProductList(productsArray);
      setLoading(false);
    });

    return () => unsubscribe();
  };

  // Fetch products on mount
  useEffect(() => {
    const unsubscribe = getProductData();
    return unsubscribe;
  }, []);

  return (
    <MyContext.Provider
      value={{
        loading,
        setLoading,
        products,
        setProducts,
        addProduct,
        productList,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export default MyState;
