import { useRef } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/ui/Navbar";
import img from "@/assets/img.png";
import { Link } from "react-router-dom";

const FirstBlock = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle redirection

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 pt-[80px]">
        {/* Left Side - Image Section */}
        <div className="hidden md:flex items-center justify-center bg-green-50 relative">
          <img
            src={img}
            alt="Waste Management"
            className="max-w-md rounded shadow"
            style={{ maxHeight: "500px" }}
          />
          <div className="absolute inset-0 bg-grey-900 bg-opacity-30" />
        </div>

        {/* Right Side - Content Section */}
        <div className="flex flex-col items-center justify-center p-12 bg-white">
          {/* Headline */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-green-700">
              Revolutionizing Waste Management
            </h1>
            <p className="text-lg text-gray-600 mt-4 max-w-lg">
              Join us in making the world cleaner! Click below to explore waste
              collection solutions and contribute to a sustainable future.
            </p>
          </div>

          {/* Redirect Button */}
          <Link
            to="/wastecollection"
            className="mt-4 bg-green-600 hover:bg-green-700 text-white hover:text-white px-6 py-3 rounded-lg shadow-md"
          >
            Waste Collection
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FirstBlock;
