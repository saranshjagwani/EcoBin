import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  FaRecycle,
  FaGlassMartini,
  FaTrashAlt,
  FaMicrochip,
  FaTint,
  FaFlask,
  FaBeer,
  FaBolt,
  FaLaptop,
  FaBatteryFull,
  FaPlug,
  FaTv,
  FaLeaf,
  FaSeedling,
} from "react-icons/fa";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { fireDB } from "@/firebase/FirebaseConfig";

const wasteCategories = {
  plastic: [
    {
      name: "PET (1)",
      icon: <FaRecycle className="text-blue-500 text-3xl" />,
      coins: 20,
    },
    {
      name: "HDPE (2)",
      icon: <FaRecycle className="text-green-500 text-3xl" />,
      coins: 40,
    },
    {
      name: "PVC (3)",
      icon: <FaRecycle className="text-red-500 text-3xl" />,
      coins: 30,
    },
    {
      name: "LDPE (4)",
      icon: <FaRecycle className="text-yellow-500 text-3xl" />,
      coins: 50,
    },
    {
      name: "PP (5)",
      icon: <FaRecycle className="text-purple-500 text-3xl" />,
      coins: 25,
    },
    {
      name: "PS (6)",
      icon: <FaRecycle className="text-orange-500 text-3xl" />,
      coins: 35,
    },
    {
      name: "Other (7)",
      icon: <FaRecycle className="text-gray-500 text-3xl" />,
      coins: 10,
    },
  ],
  organic: [
    {
      name: "Home Waste",
      icon: <FaLeaf className="text-green-500 text-3xl" />,
      coins: 15,
    },
    {
      name: "Farm Waste",
      icon: <FaSeedling className="text-brown-500 text-3xl" />,
      coins: 25,
    },
  ],
  metal: [
    {
      name: "Aluminum",
      icon: <FaBolt className="text-gray-500 text-3xl" />,
      coins: 30,
    },
    {
      name: "Steel",
      icon: <FaTrashAlt className="text-blue-500 text-3xl" />,
      coins: 25,
    },
    {
      name: "Copper",
      icon: <FaTrashAlt className="text-red-500 text-3xl" />,
      coins: 35,
    },
  ],
  electronic: [
    {
      name: "Batteries",
      icon: <FaBatteryFull className="text-green-500 text-3xl" />,
      coins: 50,
    },
    {
      name: "Circuit Boards",
      icon: <FaLaptop className="text-blue-500 text-3xl" />,
      coins: 40,
    },
    {
      name: "Wires",
      icon: <FaPlug className="text-yellow-500 text-3xl" />,
      coins: 20,
    },
    {
      name: "Screens",
      icon: <FaTv className="text-purple-500 text-3xl" />,
      coins: 45,
    },
  ],
};

const categories = [
  { name: "plastic", icon: <FaRecycle className="text-blue-500 text-6xl" /> },
  { name: "organic", icon: <FaLeaf className="text-green-500 text-6xl" /> },
  { name: "metal", icon: <FaTrashAlt className="text-gray-500 text-6xl" /> },
  {
    name: "electronic",
    icon: <FaMicrochip className="text-purple-500 text-6xl" />,
  },
];

const WasteCollection = () => {
  const [selected, setSelected] = useState({ category: null, waste: null });
  const [uploadedImage, setUploadedImage] = useState(null);
  const [coins, setCoins] = useState(0);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const email = user?.email || "Guest";
    const userData = JSON.parse(localStorage.getItem(email) || '{"coins":0}');
    setCoins(userData.coins);
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedImage(URL.createObjectURL(file));
    const waste = wasteCategories[selected.category].find((w) => w.name === selected.waste);
    const earnedCoins = waste ? waste.coins : 0;

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const email = user?.email || "Guest";
    const userData = JSON.parse(localStorage.getItem(email) || '{"coins":0}');
    userData.coins += earnedCoins;
    localStorage.setItem(email, JSON.stringify(userData));
    setCoins(userData.coins);

    try {
      setLoading(true);
      await addDoc(collection(fireDB, "waste_submissions"), {
        category: selected.category,
        waste: selected.waste,
        image: uploadedImage,
        address,
        coinsEarned: earnedCoins,
        timestamp: new Date(),
      });
      setMessage("Waste submission successful!");
    } catch (error) {
      console.error("Error submitting waste: ", error);
      setMessage("Submission failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-5">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Select Type of Waste</h1>
      {!selected.category ? (
        <motion.div className="grid grid-cols-2 gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {categories.map(({ name, icon }) => (
            <Card key={name} className="p-6 cursor-pointer hover:shadow-xl bg-white rounded-2xl" onClick={() => setSelected({ category: name, waste: null })}>
              <CardContent className="flex flex-col items-center">{icon}<p className="mt-3 text-xl font-semibold text-gray-700">{name}</p></CardContent>
            </Card>
          ))}
        </motion.div>
      ) : !selected.waste ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold mb-4 capitalize text-gray-700">{selected.category} Waste Types</h2>
          <div className="grid grid-cols-2 gap-4">
            {wasteCategories[selected.category].map(({ name, icon }) => (
              <div key={name} className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100" onClick={() => setSelected({ ...selected, waste: name })}>
                {icon}
                <p className="ml-3 text-lg font-medium text-gray-700">{name}</p>
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold mb-4 text-gray-700">{selected.waste}</h2>
          {!uploadedImage ? (
            <>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4 hidden" id="file-upload" />
              <label htmlFor="file-upload" className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-md">Upload Waste Image</label>
          
          <input type="text" placeholder="Enter your address" value={address} onChange={(e) => setAddress(e.target.value)} className="border p-2 rounded-md w-full mt-3 text-white" />
            </>
          ) : (
            <>
              <img src={uploadedImage} alt="Uploaded Waste" className="w-40 h-40 object-cover mx-auto rounded-lg mt-4" />
              <p className="text-xl font-bold text-green-600 mt-2">+{wasteCategories[selected.category].find((w) => w.name === selected.waste)?.coins} Coins Earned!</p>
              {message && <p className="text-gray-600 mt-2">{message}</p>}
            </>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default WasteCollection;
