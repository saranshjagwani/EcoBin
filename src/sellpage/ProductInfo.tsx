import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  onSnapshot,
  updateDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { fireDB } from "@/firebase/FirebaseConfig";
import Navbar from "@/components/ui/Navbar";
import { MinusCircle, PlusCircle } from "lucide-react";

const ProductInfo: React.FC = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userEmail = user?.email || user?.user?.email || "Guest";
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState<any>(null); // Store product details
  const [cart, setCart] = useState<Record<string, any>>({}); // Store cart items

  const fetchProduct = async () => {
    try {
      if (id) {
        const productRef = doc(fireDB, "products", id);
        const productSnapshot = await getDoc(productRef);
        if (productSnapshot.exists()) {
          setProduct({ id: productSnapshot.id, ...productSnapshot.data() }); // Include the id
        } else {
          console.error("Product not found");
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const fetchCart = () => {
    const cartRef = collection(fireDB, "cart");
    const unsubscribe = onSnapshot(cartRef, (querySnapshot) => {
      const cartData: Record<string, any> = {};
      querySnapshot.forEach((doc) => {
        cartData[doc.id] = doc.data();
      });
      setCart(cartData);
    });

    return () => unsubscribe();
  };

  const addToCart = async (product: any) => {
    if (!product || !product.id) {
      console.error("Product is undefined or missing an ID:", product);
      alert("Unable to add product to cart. Please try again.");
      return;
    }

    try {
      const cartRef = doc(fireDB, "cart", product.id);
      if (cart[product.id]) {
        await updateDoc(cartRef, { quantity: cart[product.id].quantity + 1 });
      } else {
        await setDoc(cartRef, {
          id: product.id,
          title: product.title || "Unknown Title",
          price: product.price || 0,
          quantity: 1,
          imageUrl: product.imageUrl || "",
          alternativefor: product.alternativefor || "Uncategorized",
          orderStatus: false,
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart. Please try again.");
    }
  };

  const incrementQuantity = async (productId: string) => {
    try {
      if (cart[productId]) {
        const cartRef = doc(fireDB, "cart", productId);
        await updateDoc(cartRef, { quantity: cart[productId].quantity + 1 });
      }
    } catch (error) {
      console.error("Error incrementing quantity:", error);
    }
  };

  const decrementQuantity = async (productId: string) => {
    try {
      if (cart[productId]?.quantity > 1) {
        const cartRef = doc(fireDB, "cart", productId);
        await updateDoc(cartRef, { quantity: cart[productId].quantity - 1 });
      } else if (cart[productId]) {
        await deleteDoc(doc(fireDB, "cart", productId));
      }
    } catch (error) {
      console.error("Error decrementing quantity:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchCart();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <section className="text-gray-600 body-font overflow-hidden">
        <div className="container px-5 py-32 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <img
              alt="ecommerce"
              className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
              src={product.imageUrl}
            />
            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">
                {product.alternativefor}
              </h2>
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                {product.title}
              </h1>
              <p className="leading-relaxed mb-5">{product.description}</p>
              <div className="flex">
                <span className="title-font font-medium text-2xl text-gray-900">
                  ₹{product.price}
                </span>
                <div className="ml-auto flex items-center space-x-3">
                  {cart[product.id] ? (
                    <div className="flex items-center space-x-3">
                      <MinusCircle
                        className="w-6 h-6 text-green-600 cursor-pointer"
                        onClick={() => decrementQuantity(product.id)}
                      />
                      <span className="text-lg font-bold">
                        {cart[product.id].quantity}
                      </span>
                      <PlusCircle
                        className="w-6 h-6 text-green-600 cursor-pointer"
                        onClick={() => incrementQuantity(product.id)}
                      />
                    </div>
                  ) : (
                    <button
                      className="ml-3 py-2 px-6 bg-green-600 text-white rounded hover:bg-green-700"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>

              {/* Display Environmental and Health Ratings */}
              {product.EnvRating && (
                <p className="text-lg font-medium text-gray-700 mt-3">
                  Environmental Rating: {product.EnvRating}
                </p>
              )}
              {product.HealthRating && (
                <p className="text-lg font-medium text-gray-700 mt-1">
                  Health Rating: {product.HealthRating}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductInfo;
