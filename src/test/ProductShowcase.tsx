import React from "react";
import "./style.css"; // Add this to style the section
import placeholderImage from "@/assets/pexels-ngqah83-885021.jpg";
import { Link } from "react-router-dom";

const ProductShowcase: React.FC = () => {
  return (
    <div className="product-showcase">
      {/* Transparent Background */}
      <div className="showcase-container">
        {/* Flexbox Layout for Left (Image) and Right (Content) */}
        <div className="flex-container">
          {/* Image Section */}
          <div className="image-section">
            <img
              src={placeholderImage}
              alt="Eco-friendly product"
              className="product-image"
            />
          </div>

          {/* Text Section (Content) */}
          <div className="text-section">
            <h2 className="headline">Check Alternative</h2>
            <p className="description">
              Explore sustainable alternatives to everyday products and make
              eco-friendly choices that contribute to a healthier planet.
            </p>
            <button className="buy-now-button">
              <Link to="/searchpage" className="text-white">
                View Details
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductShowcase;
