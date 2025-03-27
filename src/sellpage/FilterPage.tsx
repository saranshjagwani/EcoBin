import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { fireDB } from "@/firebase/FirebaseConfig";
import { Link } from "react-router-dom";

const Filter: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [searchKey, setSearchKey] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Not Selected");
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(fireDB, "products"));
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
        setFilteredProducts(productList);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const results = products.filter((product) => {
      const category = product?.Category?.toLowerCase();
      return (
        category === selectedCategory.toLowerCase()
      );
    });
    setFilteredProducts(results);
  }, [searchKey, selectedCategory, products]);

  return (
    <div className="container mx-auto px-6 pt-5">
      <div className="p-6 rounded-lg bg-gray-100 drop-shadow-xl border border-gray-200 w-full max-w-7xl mx-auto">
        <div className="relative mb-4">
          <input
            type="text"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            placeholder="Search for sustainable products"
            className="px-8 py-3 w-full rounded-md bg-gray-50 border-transparent outline-0 text-sm"
          />
        </div>
        <div className="mb-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 w-full rounded-md bg-gray-50 border-transparent outline-0 text-sm"
          >
            <option value="notselect">Not Selected</option>
            <option value="kitchen">Kitchen</option>
            <option value="stationery">Stationery</option>
            <option value="fashion">Fashion</option>
            <option value="wellness">Wellness</option>
            <option value="homedecor">Home Decor</option>
            <option value="toys">Toys</option>
          </select>
        </div>
        {loading ? (
          <div className="text-center mt-6">Loading products...</div>
        ) : (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="h-full border-2 border-gray-200 border-opacity-60 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-green-300 transition-shadow duration-300 ease-in-out"
                >
                  <div className="flex justify-center">
                    <Link
                      to={`/product/${product.id}`}
                      className="flex justify-center cursor-pointer"
                    >
                      <img
                        className="rounded-xl w-full h-80 p-2 hover:scale-105 transition-transform duration-300 ease-in-out"
                        src={
                          product.imageUrl ||
                          "https://via.placeholder.com/400x300?text=Eco+Product"
                        }
                        alt={product.title || "Eco-friendly Product"}
                      />
                    </Link>
                  </div>
                  <div className="p-5 border-t-2">
                    <h2 className="tracking-widest text-xs title-font font-medium mb-1 text-green-600">
                      {product.alternativefor || "EcoMove"}
                    </h2>
                    <h1 className="title-font text-lg font-medium mb-3">
                      {product.title || "Sustainable Product Title"}
                    </h1>
                    <p className="leading-relaxed mb-3">
                      ₹{product.price || "500"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p></p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Filter;
