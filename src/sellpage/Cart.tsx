import React, { useEffect, useState } from 'react';
import Navbar from '@/components/ui/Navbar';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { fireDB } from '@/firebase/FirebaseConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [coins, setCoins] = useState(0); 
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    name: '',
    address: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email || user?.user?.email || "Guest";


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

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        const cartRef = collection(fireDB, 'cart');
        const snapshot = await getDocs(cartRef);
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCartItems(items);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        toast.error('Failed to load cart items.');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const calculateTotal = () => {
    let subtotal = 0;
    cartItems.forEach((item) => {
      subtotal += item.price * item.quantity;
    });
    let shipping = subtotal >= 300 ? 0 : 120;
    
    let total = shipping + subtotal -coins ;
    if(total<0){
      total=0;
    }
   
    return { subtotal, shipping, total };
  };

  const handleOrder = async () => {
    const { total } = calculateTotal();
    const userData = JSON.parse(
      localStorage.getItem(email) || '{"coins":0, "images":[]}'
    );
    let remcoins = coins - (subtotal + shipping);

    if (remcoins < 0) {
      userData.coins = 0;
    } else {
      userData.coins = remcoins;
    }
    
    localStorage.setItem(email, JSON.stringify(userData)); // Update localStorage
    
    

    // Validate form data
    if (
      !formData.name ||
      !formData.address ||
      !formData.phoneNumber ||
      formData.phoneNumber.length < 10 ||
      !formData.cardNumber ||
      !formData.expiryDate ||
      !formData.cvv
    ) {
      toast.error('Please fill out all fields correctly.');
      return;
    }

    // Validate CVV (should be a 3-digit number)
    if (!/^\d{3}$/.test(formData.cvv)) {
      toast.error('CVV must be a 3-digit number.');
      return;
    }

    // Validate Expiry Date (should be in MM/YY format)
    if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(formData.expiryDate)) {
      toast.error('Please enter a valid expiry date (MM/YY).');
      return;
    }

    // Dummy payment validation
    if (formData.cardNumber !== '1234 8765 4321') {
      toast.error('Invalid card number. Please try again.');
      return;
    }

    const orderDetails = {
      ...formData,
      cartItems,
      total,
      date: new Date().toLocaleString(),
    };

    try {
      // Update each cart item's orderStatus to true
      for (const item of cartItems) {
        const cartItemRef = doc(fireDB, 'cart', item.id);
        await updateDoc(cartItemRef, { orderStatus: true });
      }

      // Add order details to a new collection (e.g., 'orders')
      await addDoc(collection(fireDB, 'orders'), orderDetails);

      toast.success('Order placed successfully!');
      setCartItems([]);
      setIsDialogOpen(false);
      setFormData({ phoneNumber: '', name: '', address: '', cardNumber: '', expiryDate: '', cvv: '' });
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order.');
    }
  };

  const { subtotal, shipping, total } = calculateTotal();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex flex-col mt-16 px-4 sm:px-6 lg:px-8 md:w-[1100px]">
        <div className="flex-grow pt-5">
          <h1 className="text-center text-2xl font-bold mb-8">Cart Items</h1>
          <div className="w-full bg-white p-6 rounded-lg shadow-lg">
            <div className="mb-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between mb-4"
                >
                  <p className="text-gray-700">{item.title}</p>
                  <p className="text-gray-700">₹{item.price}*{item.quantity}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-gray-700">Subtotal</p>
              <p className="text-gray-700">₹{subtotal}</p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-gray-700">Shipping</p>
              <p className="text-gray-700">₹{shipping}</p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-gray-700">Coins</p>
              <p className="text-gray-700">-₹{coins}</p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-lg font-bold">Total</p>
              <p className="text-lg font-bold">₹{total}</p>
            </div>
            {/* Disable button if subtotal is 0 */}
            <button
              type="button"
              className={`w-full py-2 text-center rounded-lg text-white font-bold ${subtotal === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-violet-600'}`}
              onClick={() => subtotal !== 0 && setIsDialogOpen(true)} // Open the dialog only if subtotal is not 0
              disabled={subtotal === 0}
            >
              Tap To Confirm
            </button>
          </div>
        </div>
      </div>

      {/* Order Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-white bg-black"
              placeholder="Full Name"
            />
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, address: e.target.value }))
              }
              className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-white bg-black"
              placeholder="Address"
            />
            <input
              type="text"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))
              }
              className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-white bg-black"
              placeholder="Phone Number"
            />
            <input
              type="text"
              value={formData.cardNumber}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, cardNumber: e.target.value }))
              }
              className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-white bg-black"
              placeholder="Card Number"
            />
            <input
              type="text"
              value={formData.expiryDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, expiryDate: e.target.value }))
              }
              className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-white bg-black"
              placeholder="MM/YY Expiry Date"
            />
            <input
              type="text"
              value={formData.cvv}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, cvv: e.target.value }))
              }
              className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-white bg-black"
              placeholder="CVV"
            />
            <div className="flex justify-between">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleOrder}
                className="bg-violet-600 text-white py-2 px-4 rounded-lg"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
