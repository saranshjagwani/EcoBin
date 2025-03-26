const Footer = () => {
  return (
    <footer className="bg-green-700 text-white py-12 mt-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left side - Website Name and Description */}
          <div>
            <h2 className="text-3xl font-bold text-green-200 mb-4">EcoMove</h2>
            <p className="text-sm text-green-100 mb-4">
              Your eco-friendly guide to sustainability. 
            </p>
            <div className="text-sm text-green-100">
              <p>&copy; {new Date().getFullYear()} EcoMove. All rights reserved.</p>
            </div>
          </div>

          {/* Center - Social Media Links */}
          <div className="flex justify-center md:justify-start space-x-8">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-100 hover:text-white text-lg transition duration-200 ease-in-out transform hover:scale-110"
            >
              Twitter
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-100 hover:text-white text-lg transition duration-200 ease-in-out transform hover:scale-110"
            >
              Facebook
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-100 hover:text-white text-lg transition duration-200 ease-in-out transform hover:scale-110"
            >
              Instagram
            </a>
          </div>

          {/* Right side - Image Section */}
          <div className="w-full px-4">
            <img src="https://ecommerce-sk.vercel.app/pay.png" alt="Payment Options" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
