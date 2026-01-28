import React, { useState } from 'react';

const AuctionBidding = ({ auction = {}, onBidPlaced, onClose }) => {
  const {
    productName = 'Auction Item',
    farmerName = 'Farmer',
    quantity = '',
    currentBid,
    startingPrice,
    bids,
    endTime,
    minIncrement = 1,
    description = '',
    quality,
    delivery
  } = auction || {};

  const basePrice = Number(currentBid ?? startingPrice ?? 0);
  const [amount, setAmount] = useState(basePrice + Number(minIncrement || 1));
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!onBidPlaced) return;
    if (Number.isNaN(Number(amount))) return;
    if (Number(amount) < basePrice + Number(minIncrement || 1)) return;
    try {
      setSubmitting(true);
      await Promise.resolve(onBidPlaced(Number(amount)));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Place a Bid</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-200 mb-4">
            <div className="flex justify-between"><span>Item</span><span>{productName}</span></div>
            <div className="flex justify-between"><span>Farmer</span><span>{farmerName}</span></div>
            {quantity && <div className="flex justify-between"><span>Quantity</span><span>{quantity}</span></div>}
            <div className="flex justify-between"><span>Current/Base Price</span><span>₹{basePrice.toLocaleString()}</span></div>
            {typeof bids !== 'undefined' && <div className="flex justify-between"><span>Total Bids</span><span>{bids}</span></div>}
            {endTime && <div className="flex justify-between"><span>Ends</span><span>{new Date(endTime).toLocaleString()}</span></div>}
            {quality && <div className="flex justify-between"><span>Quality</span><span>{quality}</span></div>}
            {delivery && <div className="flex justify-between"><span>Delivery</span><span>{delivery}</span></div>}
            {description && <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{description}</p>}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Bid</label>
              <input
                type="number"
                step={minIncrement}
                min={basePrice + Number(minIncrement || 1)}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Minimum increment: ₹{Number(minIncrement || 1).toLocaleString()}
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Cancel</button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md"
              >
                {submitting ? 'Placing...' : 'Place Bid'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuctionBidding;


