import React, { useContext, useEffect, useState } from "react";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { fireDB } from "@/firebase/FirebaseConfig";
import myContext from "@/Context/data/myContext";
import { MinusCircle, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

const ProductCard: React.FC = () => {
  const context = useContext(myContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<Record<string, any>>({});

  if (!context) {
    throw new Error("ProductCard must be used within a Provider.");
  }

  const fetchProducts = () => {
    setLoading(true);
    const productQuery = query(collection(fireDB, "products"), orderBy("time", "desc"));
    const unsubscribe = onSnapshot(productQuery, (querySnapshot) => {
      const productsArray = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setProducts(productsArray);
      setLoading(false);
    });

    return () => unsubscribe();
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
    fetchProducts();
    fetchCart();
  }, []);

  return (
<section className="text-gray-600 body-font bg-green-50 py-8">
  <div className="container mx-auto px-5 py-8 md:py-16">
    <div className="mb-10 text-center">
      <h1 className="sm:text-4xl text-3xl font-semibold title-font text-green-800 mb-2">
        Our Sustainable Collection
      </h1>
      <p className="text-base leading-relaxed text-gray-600">
        Discover eco-friendly products that make a difference.
      </p>
    </div>

    {loading ? (
      <div className="flex justify-center items-center h-64">
        <div className="loader"></div>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border border-gray-300 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white"
          >
            <Link to={`/product/${product.id}`} className="block">
              <img
                src={
                  product.imageUrl ||
                  "https://via.placeholder.com/400x300?text=Eco+Product"
                }
                alt={product.title || "Eco-friendly Product"}
                className="w-full h-60 object-cover transition-transform duration-300 ease-in-out hover:scale-105"
              />
            </Link>
            <div className="p-5">
              <h2 className="text-sm font-medium text-green-600 uppercase tracking-wide mb-2">
                {product.alternativefor || "EcoMove"}
              </h2>
              <h1 className="text-lg font-bold text-gray-800 mb-2">
                {product.title || "Sustainable Product"}
              </h1>
              <p className="text-base font-semibold text-gray-600 mb-4">
                ₹{product.price || "500"}
              </p>
              <div className="flex items-center justify-between">
                {cart[product.id] ? (
                  <div className="flex items-center space-x-3">
                    <MinusCircle
                      className="w-6 h-6 text-green-600 cursor-pointer"
                      onClick={() => decrementQuantity(product.id)}
                    />
                    <span className="text-lg font-bold">{cart[product.id].quantity}</span>
                    <PlusCircle
                      className="w-6 h-6 text-green-600 cursor-pointer"
                      onClick={() => incrementQuantity(product.id)}
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => addToCart(product)}
                    className="w-full py-2 px-4 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</section>

  );
};

export default ProductCard;
