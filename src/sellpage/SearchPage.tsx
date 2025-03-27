import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { fireDB } from "@/firebase/FirebaseConfig"; // Ensure this points to your Firebase configuration
import { Link } from "react-router-dom";
import Navbar from "@/components/ui/Navbar";

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [noResults, setNoResults] = useState<boolean>(false);

  // Debounced search query
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      }
    }, 500); // Delay of 500ms before searching

    return () => clearTimeout(timeoutId); // Cleanup on searchQuery change
  }, [searchQuery]);

  const handleSearch = async () => {
    if (searchQuery.trim() === "") return;

    setLoading(true);
    setNoResults(false); // Reset noResults state

    const productsRef = collection(fireDB, "products");

    try {
      // Query to find products matching the alternative name or title
      const q = query(
        productsRef,
        where("alternativefor", "==", searchQuery) // You can also query for title if needed
      );

      const querySnapshot = await getDocs(q);
      const resultsArray = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setSearchResults(resultsArray);
      setNoResults(resultsArray.length === 0); // Set noResults to true if no results
    } catch (error) {
      console.error("Error searching for products:", error);
    }

    setLoading(false);
  };

  return (
    <div className="container mx-auto px-5 py-8">
        <Navbar/>
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search for alternative products..."
          className="p-4 w-80 rounded-lg shadow-md border text-white bg-black"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="loader"></div>
        </div>
      ) : noResults ? (
        <div className="text-center text-lg text-gray-500">No results found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {searchResults.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="flex justify-center cursor-pointer"
            >
              <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-green-300 transition-shadow duration-300 ease-in-out">
                <div className="flex justify-center">
                  <img
                    className="rounded-xl w-full h-80 p-2 hover:scale-105 transition-transform duration-300 ease-in-out"
                    src={product.imageUrl || "https://via.placeholder.com/400x300?text=Eco+Product"}
                    alt={product.title || "Eco-friendly Product"}
                  />
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
                  <button className="focus:outline-none text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm py-2 px-4 transition-all">
                    View Product
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
