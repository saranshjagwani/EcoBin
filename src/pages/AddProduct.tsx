import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { fireDB } from "@/firebase/FirebaseConfig";
import { toast } from "react-toastify";

// Define interface for error types
interface ProductErrors {
  title?: string;
  price?: string;
  imageUrl?: string;
  alternativefor?: string;
  Category?: string;
  description?: string;
}

const AddProduct = () => {
  const [products, setProducts] = useState({
    title: "",
    price: "",
    imageUrl: "",
    alternativefor: "",
    Category: "",
    description: "",
    time: Timestamp.now(),
    date: new Date().toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ProductErrors>({});
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProducts((prev) => ({ ...prev, [name]: value }));
  };

  // Validate form fields
  const validateFields = () => {
    const { title, price, imageUrl, alternativefor, description, Category } = products;
    const errors: ProductErrors = {};

    if (!title) errors.title = "Title is required.";
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      errors.price = "Price must be a valid positive number.";
    }
    if (!imageUrl) errors.imageUrl = "Image URL is required.";
    if (!alternativefor) errors.alternativefor = "Alternative For is required.";
    if (!description) errors.description = "Description is required.";
    if (!Category) errors.Category = "Category is required.";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addProduct = async () => {
    if (!validateFields()) return;

    setLoading(true);

    try {
      const productRef = collection(fireDB, "products");
      await addDoc(productRef, products);
      toast.success("Product added successfully");
      setProducts({
        title: "",
        price: "",
        imageUrl: "",
        alternativefor: "",
        Category: "",
        description: "",
        time: Timestamp.now(),
        date: new Date().toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-xl font-bold text-center mb-4 text-yellow-50">Add New Product</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addProduct();
          }}
        >
          <input
            type="text"
            name="title"
            placeholder="Enter Product Title"
            className="bg-gray-600 mb-4 px-2 py-2 w-full rounded-lg text-white placeholder:text-gray-200 outline-none"
            value={products.title}
            onChange={handleChange}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}

          <input
            type="text"
            name="price"
            placeholder="Enter Product Price (e.g., 49.99)"
            className="bg-gray-600 mb-4 px-2 py-2 w-full rounded-lg text-white placeholder:text-gray-200 outline-none"
            value={products.price}
            onChange={handleChange}
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}

          <input
            type="text"
            name="imageUrl"
            placeholder="Enter Image URL"
            className="bg-gray-600 mb-4 px-2 py-2 w-full rounded-lg text-white placeholder:text-gray-200 outline-none"
            value={products.imageUrl}
            onChange={handleChange}
          />
          {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>}

          <input
            type="text"
            name="alternativefor"
            placeholder="Enter Alternative For"
            className="bg-gray-600 mb-4 px-2 py-2 w-full rounded-lg text-white placeholder:text-gray-200 outline-none"
            value={products.alternativefor}
            onChange={handleChange}
          />
          {errors.alternativefor && <p className="text-red-500 text-sm mt-1">{errors.alternativefor}</p>}

          <input
            type="text"
            name="Category"
            placeholder="Category"
            className="bg-gray-600 mb-4 px-2 py-2 w-full rounded-lg text-white placeholder:text-gray-200 outline-none"
            value={products.Category}
            onChange={handleChange}
          />
          {errors.Category && <p className="text-red-500 text-sm mt-1">{errors.Category}</p>}

          <textarea
            name="description"
            placeholder="Enter Product Description"
            className="bg-gray-600 mb-4 px-2 py-2 w-full rounded-lg text-white placeholder:text-gray-200 outline-none"
            value={products.description}
            onChange={handleChange}
          ></textarea>
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 text-white rounded ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
          >
            {loading ? "Adding Product..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
