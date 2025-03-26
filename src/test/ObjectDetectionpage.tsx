import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import { useState, useEffect, useRef } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/ui/Navbar";
import img from "@/assets/img.png";

const HomePage = () => {
  const [model, setModel] = useState<any>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loadingModel, setLoadingModel] = useState(true); // For model loading animation
  const [detecting, setDetecting] = useState(false); // For detection animation
  const [timer, setTimer] = useState(false); // For controlling loader timer
  const imageRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load COCO-SSD model
  useEffect(() => {
    const loadModel = async () => {
      setLoadingModel(true); // Start loading modal
      await tf.ready();
      const loadedModel = await cocoSsd.load();
      setModel(loadedModel);
      console.log("Model loaded successfully.");
      setLoadingModel(false); // Hide loading modal
    };
    loadModel();
  }, []);

  // Handle file upload
  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setImageURL(reader.result.toString());
          setResults([]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input
  const triggerUpload = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // Run object detection with animation
  const detectObjects = async () => {
    setDetecting(true); // Start detecting animation
    setTimer(true); // Start 5-second loader
    setTimeout(async () => {
      if (model && imageRef.current) {
        const predictions = await model.detect(imageRef.current);

        const detailedResults = predictions.map((prediction) => {
          const categoryMap: Record<string, string> = {
            bottle: "Plastic Water Bottle",
            cup: "Disposable Coffee Cup",
            refrigerator: "Refrigerator (CFC Releaser)",
            banana: "Organic Waste - Banana Peel",
          };

          return {
            ...prediction,
            description: categoryMap[prediction.class] || prediction.class,
          };
        });

        setResults(detailedResults);
      }
      setDetecting(false); // Stop detecting animation
      setTimer(false); // Stop the 5-second loader
    }, 200); // 5-second delay for loader
  };

  // Categorize detected items
  const categorizeItem = (description: string) => {
    const recyclable = ["Plastic Water Bottle", "Glass Jar", "Aluminum Can"];
    const nonRecyclable = ["Plastic Bag", "Disposable Coffee Cup"];
    const ecoFriendly = ["Reusable Water Bottle", "Bamboo Straw"];
    const hazardous = ["phone", "laptop", "refrigerator"];

    if (recyclable.includes(description)) return "Recyclable";
    if (nonRecyclable.includes(description)) return "Non-Recyclable";
    if (ecoFriendly.includes(description)) return "Eco-Friendly Alternative";
    if (hazardous.includes(description)) return "Hazardous Waste";
    return "Uncategorized";
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Modal for Model Loading */}
      {loadingModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <Loader2 className="animate-spin w-14 h-14 text-green-600 mx-auto" />
            <p className="text-lg text-green-700 mt-4">Loading Model...</p>
          </div>
        </div>
      )}

      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 pt-[80px]">
        {/* Left Side - Image Section */}
        <div className="hidden md:flex items-center justify-center bg-green-50 relative">
          {imageURL ? (
            <img
              src={imageURL}
              alt="Uploaded Product"
              ref={imageRef}
              className="max-w-md rounded shadow"
              style={{ maxHeight: "450px" }}
            />
          ) : (
            <img
              src={img}
              alt="Placeholder"
              className="max-w-md rounded shadow"
              style={{ maxHeight: "500px" }}
            />
          )}
          <div className="absolute inset-0 bg-grey-900 bg-opacity-30" />
        </div>

        {/* Right Side - Content Section */}
        <div className="flex flex-col items-center justify-center p-12 bg-white">
          {/* Headline */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-green-700">
              Discover Sustainability
            </h1>
            <p className="text-lg text-gray-600 mt-4 max-w-lg">
              Upload a product image to identify its components and categorize them.
            </p>
          </div>

          {/* File Upload Section */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <div
              onClick={triggerUpload}
              className="w-36 h-36 bg-white rounded-full border-4 border-green-400 flex items-center justify-center hover:bg-green-100 cursor-pointer shadow-lg transition-transform transform hover:scale-105"
            >
              <UploadCloud className="w-14 h-14 text-green-600" />
            </div>
            <p className="text-sm text-gray-600">Click to upload product image</p>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={uploadImage}
            />
          </div>

          {/* Detect Objects Button */}
          {imageURL && (
            <Button
              onClick={detectObjects}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md"
            >
              Detect Objects
            </Button>
          )}

          {/* Loading Animation for Object Detection */}
          {timer && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <Loader2 className="animate-spin w-14 h-14 text-green-600 mx-auto" />
                <p className="text-lg text-green-700 mt-4">Detecting Objects...</p>
              </div>
            </div>
          )}

          {/* Display Detection Results */}
          {!detecting && results.length > 0 && (
            <div className="mt-4">
              <h2 className="text-2xl font-semibold">Detected Items:</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {results.map((item, index) => (
                  <div
                    key={index}
                    className="border p-4 rounded-lg shadow-md bg-gray-100"
                  >
                    <h3 className="text-lg font-bold">{item.description}</h3>
                    <p className="text-sm text-gray-600">
                      Category: {categorizeItem(item.description)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Message if no results */}
          {results.length === 0 && imageURL && !detecting && (
            <p className="mt-4">
              No objects detected yet. Try clicking "Detect Objects".
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
