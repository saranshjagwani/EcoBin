import React, { useContext, useState } from "react";
import ObjectDetection from "@/ecomovetest/ObjectDetectionpage";
import Navbar from "@/components/ui/Navbar";
import IntroVideo from "@/ecomovetest/IntroVideo";
import Footer from "./Footer";
import myContext from "@/Context/data/myContext";
import ProductShowcase from "./ProductShowcase";
import FirstBlock from "./FirstBlock";

const MainTest: React.FC = () => {
  const context = useContext(myContext);
  const [showBanner, setShowBanner] = useState(true);


  // Handle null context (when not wrapped with a provider)
  if (!context) {
    return (
      <p>
        Error: Context not found. Please wrap your component with the Provider.
      </p>
    );
  }

  // Close the banner
  const closeBanner = () => {
    setShowBanner(false);
  };

  return (
    <div>
      {/* Navbar Section */}
      <Navbar />

     
  

      {/* Main Content */}
      <div>
        <FirstBlock/>
      </div>

      {/* Product Showcase Section */}
      <IntroVideo />
      <div>
        <ProductShowcase />
      </div>

      {/* Footer Section */}
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default MainTest;
