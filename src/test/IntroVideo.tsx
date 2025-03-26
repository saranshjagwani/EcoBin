import React from "react";
import "./style.css"; // Add this to style the section
import placeholderImage from "@/assets/tabelets.jpg";
import { Link } from "react-router-dom";

const ProductShowcase: React.FC = () => {
  return (
    <div className="product-showcase">
      {/* Transparent Background */}
      <div className="showcase-container">
        {/* Text Section */}
        <div className="text-section">
          <h2 className="headline">Buy Sustainable</h2>
          <p className="description">
            Discover eco-friendly products that align with your values. Make the
            choice to protect our planet today!
          </p>
          <button className="buy-now-button">
            <Link to="/product" className="text-white">
              Buy Now
            </Link>
          </button>
        </div>

        {/* Image Section */}
        <div className="image-section md:hidden">
          <img
            src={placeholderImage}
            alt="Eco-friendly product"
            className="product-image"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductShowcase;
