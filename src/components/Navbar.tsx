import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, Coins } from "lucide-react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [coins, setCoins] = useState(0); // State for coin balance
  const navigate = useNavigate();

  // Get user from local storage
  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email || user?.user?.email || "Guest";

  // Fetch user-specific data from local storage
  useEffect(() => {
    const fetchCoins = () => {
      const userData = JSON.parse(
        localStorage.getItem(email) || '{"coins":0, "images":[]}'
      );
      setCoins(userData.coins);
    };

    fetchCoins(); // Initial fetch

    // Polling local storage for changes (since storage events don't work in the same tab)
    const interval = setInterval(fetchCoins, 100); // Check every second

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [email]);

  // Toggle the mobile menu
  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-green-600 dark:text-green-400"
          >
            EcoMove
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition"
            >
              Home
            </Link>
            <Link
              to="/product"
              className="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition"
            >
              Products
            </Link>
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition"
            >
              Admin
            </Link>
            <Link
              to="/objdetect"
              className="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition"
            >
              Object Detection
            </Link>
            {user && (
              <a
                onClick={logout}
                className="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition cursor-pointer"
              >
                Logout
              </a>
            )}
            <div className="flex items-center space-x-2  ">
              <Coins className="text-yellow-600 w-6 h-6 " /> {/* Coin icon */}
              <span className="text-lg font-semibold text-yellow-600 mr-3">
                {coins}
              </span>{" "}
              {/* Coin balance */}
              <Link
                to="/cart"
                className="flex items-center space-x-1 text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition ml-112"
              >
                <ShoppingCart />
              </Link>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-green-600 dark:text-green-400"
            onClick={toggleMenu}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
