import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LiveBidding = ({ auction, onBidPlaced }) => {
  const { user } = useAuth();
  const [bidAmount, setBidAmount] = useState('');
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [bids, setBids] = useState([]);
  const [error, setError] = useState('');

  // Calculate time left
  useEffect(() => {
    if (!auction.endDate) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const endTime = new Date(auction.endDate.toDate());
      const difference = endTime - now;

      if (difference <= 0) {
        setTimeLeft('Auction Ended');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [auction.endDate]);

  // Fetch bids
  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await fetch(`/api/bids/auction/${auction.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setBids(data.bids || []);
        }
      } catch (error) {
        console.error('Error fetching bids:', error);
      }
    };

    fetchBids();
    // Poll for new bids every 5 seconds
    const interval = setInterval(fetchBids, 5000);

    return () => clearInterval(interval);
  }, [auction.id]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    
    if (!bidAmount || parseFloat(bidAmount) <= 0) {
      setError('Please enter a valid bid amount');
      return;
    }

    const amount = parseFloat(bidAmount);
    const minBid = auction.currentBid + auction.minIncrement;

    if (amount < minBid) {
      setError(`Minimum bid must be ₹${minBid}`);
      return;
    }

    setIsPlacingBid(true);
    setError('');

    try {
      const response = await fetch(`/api/auctions/${auction.id}/bid`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bidAmount: amount })
      });

      const data = await response.json();

      if (response.ok) {
        setBidAmount('');
        setError('');
        if (onBidPlaced) {
          onBidPlaced(data.bid);
        }
        // Refresh bids
        const bidsResponse = await fetch(`/api/bids/auction/${auction.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        if (bidsResponse.ok) {
          const bidsData = await bidsResponse.json();
          setBids(bidsData.bids || []);
        }
      } else {
        setError(data.message || 'Failed to place bid');
      }
    } catch (error) {
      console.error('Error placing bid:', error);
      setError('Network error occurred');
    } finally {
      setIsPlacingBid(false);
    }
  };

  const isAuctionActive = auction.status === 'active' && auction.stage === 'bidding';
  const isAuctionEnded = new Date() > new Date(auction.endDate.toDate());
  const isUserBuyer = user?.userType === 'buyer';
  const canBid = isAuctionActive && !isAuctionEnded && isUserBuyer;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Live Bidding
        </h3>
        <div className="text-right">
          <div className="text-sm text-gray-500 dark:text-gray-400">Time Remaining</div>
          <div className={`text-lg font-bold ${
            timeLeft === 'Auction Ended' ? 'text-red-600' : 'text-green-600'
          }`}>
            {timeLeft}
          </div>
        </div>
      </div>

      {/* Current Bid Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Current Bid</div>
            <div className="text-2xl font-bold text-blue-600">₹{auction.currentBid}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Minimum Increment</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">₹{auction.minIncrement}</div>
          </div>
        </div>
      </div>

      {/* Bid Form */}
      {canBid && (
        <form onSubmit={handleBidSubmit} className="mb-6">
          <div className="flex space-x-3">
            <div className="flex-1">
              <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Bid Amount (₹)
              </label>
              <input
                type="number"
                id="bidAmount"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                min={auction.currentBid + auction.minIncrement}
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder={`Minimum: ₹${auction.currentBid + auction.minIncrement}`}
                required
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={isPlacingBid || !bidAmount}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isPlacingBid ? 'Placing...' : 'Place Bid'}
              </button>
            </div>
          </div>
          {error && (
            <div className="mt-2 text-sm text-red-600">{error}</div>
          )}
        </form>
      )}

      {/* Auction Status */}
      {!canBid && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-center">
            {isAuctionEnded ? (
              <div className="text-red-600 font-semibold">Auction has ended</div>
            ) : !isUserBuyer ? (
              <div className="text-yellow-600 font-semibold">Only buyers can place bids</div>
            ) : (
              <div className="text-gray-600 dark:text-gray-400">Bidding is not currently active</div>
            )}
          </div>
        </div>
      )}

      {/* Recent Bids */}
      <div>
        <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
          Recent Bids ({bids.length})
        </h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {bids.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-4">
              No bids yet. Be the first to bid!
            </div>
          ) : (
            bids.map((bid, index) => (
              <div
                key={bid.id}
                className={`p-3 rounded-lg border ${
                  index === 0 ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-600'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      ₹{bid.bidAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(bid.bidTime.toDate()).toLocaleString()}
                    </div>
                  </div>
                  {index === 0 && (
                    <div className="text-green-600 font-semibold text-sm">
                      🏆 Highest Bid
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Winner Info */}
      {auction.winner && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
          <h4 className="text-lg font-semibold text-green-800 dark:text-green-400 mb-2">
            🎉 Auction Winner
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-green-600 dark:text-green-400">Winning Bid</div>
              <div className="text-xl font-bold text-green-800 dark:text-green-300">
                ₹{auction.winner.finalBid.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-green-600 dark:text-green-400">Winning Time</div>
              <div className="text-sm text-green-800 dark:text-green-300">
                {new Date(auction.winner.winningTime.toDate()).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveBidding;

