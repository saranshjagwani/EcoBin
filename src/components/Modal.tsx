import React, { useState } from 'react';

interface ModalProps {
  onClose: () => void;
  onSubmit: (details: { address: string }) => void;
  total: number;
  cartItems: any[];
}

const Modal: React.FC<ModalProps> = ({ onClose, onSubmit, total, cartItems }) => {
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // For handling form submission state
  const [error, setError] = useState(''); // For error handling

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address.trim()) {
      setError('Please provide a delivery address.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await onSubmit({ address });
      setAddress(''); 
      onClose();
    } catch (error) {
      setError('Failed to place the order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4">Confirm Your Order</h2>
        <p className="mb-2">Total: ₹{total}</p>

        {/* Error message display */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleFormSubmit}>
          <textarea
            placeholder="Enter your delivery address"
            className="w-full p-2 border rounded mb-4"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <div className="flex justify-between">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={onClose}
              disabled={isSubmitting} // Disable cancel button during submission
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-violet-600 text-white rounded"
              disabled={isSubmitting} // Disable submit button during submission
            >
              {isSubmitting ? 'Submitting...' : 'Confirm Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
