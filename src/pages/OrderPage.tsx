import Navbar from "@/components/ui/Navbar";
import React from "react";
import { Link } from "react-router-dom"; // If using react-router for navigation

const OrderPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Navbar />
      <div className="text-center bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Coming Soon!</h1>
        <p className="text-lg text-gray-600 mb-6">
          We're working on something amazing. Stay tuned for updates.
        </p>
        <div className="flex justify-center">
          {/* Button to Homepage */}
          <Link to="/" className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300">
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
