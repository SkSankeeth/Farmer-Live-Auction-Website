import React, { useState, useEffect } from 'react';

const AuctionStages = ({ auction, onStageUpdate, userType, isOwner }) => {
  const [currentStage, setCurrentStage] = useState(auction.stage || 'bidding');
  const [stageData, setStageData] = useState(auction.stageDetails || {});
  const [updating, setUpdating] = useState(false);

  const stages = [
    {
      id: 'bidding',
      name: 'Bidding',
      description: 'Auction is open for bidding',
      icon: '🎯',
      color: 'blue',
      canUpdate: userType === 'farmer' && isOwner
    },
    {
      id: 'harvesting',
      name: 'Harvesting',
      description: 'Farmer is harvesting the produce',
      icon: '🌾',
      color: 'green',
      canUpdate: userType === 'farmer' && isOwner
    },
    {
      id: 'loading',
      name: 'Loading',
      description: 'Produce is being loaded for transport',
      icon: '📦',
      color: 'yellow',
      canUpdate: userType === 'farmer' && isOwner
    },
    {
      id: 'billing',
      name: 'Billing',
      description: 'Payment processing and billing',
      icon: '💰',
      color: 'purple',
      canUpdate: userType === 'farmer_admin' || userType === 'super_admin'
    },
    {
      id: 'in_transit',
      name: 'In Transit',
      description: 'Produce is being transported',
      icon: '🚚',
      color: 'orange',
      canUpdate: userType === 'transporter'
    },
    {
      id: 'delivery',
      name: 'Delivery',
      description: 'Produce has been delivered',
      icon: '✅',
      color: 'green',
      canUpdate: userType === 'transporter'
    }
  ];

  const getStageIndex = (stageId) => {
    return stages.findIndex(stage => stage.id === stageId);
  };

  const getStageColor = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      green: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
    };
    return colors[color] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
  };

  const handleStageUpdate = async (newStage) => {
    if (!stages.find(s => s.id === newStage)?.canUpdate) {
      alert('You do not have permission to update this stage');
      return;
    }

    setUpdating(true);
    try {
      const newStageData = {
        ...stageData[newStage],
        startTime: new Date(),
        updatedBy: userType,
        updatedAt: new Date()
      };

      await onStageUpdate(newStage, newStageData);
      setCurrentStage(newStage);
      setStageData(prev => ({
        ...prev,
        [newStage]: newStageData
      }));
    } catch (error) {
      console.error('Error updating stage:', error);
      alert('Failed to update stage');
    } finally {
      setUpdating(false);
    }
  };

  const renderStageContent = (stage) => {
    const data = stageData[stage.id] || {};
    
    switch (stage.id) {
      case 'bidding':
        return (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Start Time:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {data.startTime ? new Date(data.startTime).toLocaleString() : 'Not started'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">End Time:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {auction.endTime ? new Date(auction.endTime).toLocaleString() : 'Not set'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Total Bids:</span>
              <span className="font-medium text-gray-900 dark:text-white">{data.totalBids || auction.bids || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Highest Bid:</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                ₹{data.highestBid || auction.currentBid || auction.startingPrice}
              </span>
            </div>
            {data.highestBidder && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Highest Bidder:</span>
                <span className="font-medium text-gray-900 dark:text-white">{data.highestBidder}</span>
              </div>
            )}
          </div>
        );

      case 'harvesting':
        return (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Start Time:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {data.startTime ? new Date(data.startTime).toLocaleString() : 'Not started'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Status:</span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                data.isReady ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
              }`}>
                {data.isReady ? 'Ready' : 'In Progress'}
              </span>
            </div>
            {data.farmerNotes && (
              <div>
                <span className="text-gray-600 dark:text-gray-400 text-sm">Notes:</span>
                <p className="text-sm text-gray-900 dark:text-white mt-1">{data.farmerNotes}</p>
              </div>
            )}
            {data.photos && data.photos.length > 0 && (
              <div>
                <span className="text-gray-600 dark:text-gray-400 text-sm">Photos:</span>
                <div className="flex space-x-2 mt-1">
                  {data.photos.map((photo, index) => (
                    <img key={index} src={photo} alt={`Harvest ${index + 1}`} className="w-12 h-12 object-cover rounded" />
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'loading':
        return (
          <div className="space-y-3">
                <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Start Time:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {data.startTime ? new Date(data.startTime).toLocaleString() : 'Not started'}
              </span>
                </div>
                <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Loading Location:</span>
              <span className="font-medium text-gray-900 dark:text-white">{data.location || 'Farm Location'}</span>
                </div>
                <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Weight:</span>
              <span className="font-medium text-gray-900 dark:text-white">{data.weight || auction.quantity}</span>
                </div>
            {data.notes && (
              <div>
                <span className="text-gray-600 dark:text-gray-400 text-sm">Loading Notes:</span>
                <p className="text-sm text-gray-900 dark:text-white mt-1">{data.notes}</p>
              </div>
            )}
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Payment Status:</span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                data.paymentStatus === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                data.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
              }`}>
                {data.paymentStatus || 'Pending'}
              </span>
            </div>
              <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Final Amount:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                ₹{data.finalAmount || auction.currentBid || auction.startingPrice}
              </span>
              </div>
              <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Commission (5%):</span>
              <span className="font-medium text-gray-900 dark:text-white">
                ₹{data.commission || Math.round((data.finalAmount || auction.currentBid || auction.startingPrice) * 0.05)}
              </span>
              </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Farmer Amount:</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                ₹{data.farmerAmount || Math.round((data.finalAmount || auction.currentBid || auction.startingPrice) * 0.95)}
              </span>
              </div>
          </div>
        );

      case 'in_transit':
        return (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Transporter:</span>
              <span className="font-medium text-gray-900 dark:text-white">{data.transporterName || 'Not assigned'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Vehicle:</span>
              <span className="font-medium text-gray-900 dark:text-white">{data.vehicleNumber || 'Not assigned'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Start Time:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {data.startTime ? new Date(data.startTime).toLocaleString() : 'Not started'}
              </span>
            </div>
              <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">ETA:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {data.eta ? new Date(data.eta).toLocaleString() : 'Not estimated'}
                </span>
              </div>
            {data.currentLocation && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Current Location:</span>
                <span className="font-medium text-gray-900 dark:text-white">{data.currentLocation}</span>
              </div>
            )}
          </div>
        );

      case 'delivery':
        return (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Delivery Time:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {data.deliveryTime ? new Date(data.deliveryTime).toLocaleString() : 'Not delivered'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Delivery Status:</span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                data.deliveryStatus === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                data.deliveryStatus === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
              }`}>
                {data.deliveryStatus || 'Pending'}
              </span>
            </div>
            {data.deliveryNotes && (
              <div>
                <span className="text-gray-600 dark:text-gray-400 text-sm">Delivery Notes:</span>
                <p className="text-sm text-gray-900 dark:text-white mt-1">{data.deliveryNotes}</p>
              </div>
            )}
            {data.recipientSignature && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Recipient:</span>
                <span className="font-medium text-gray-900 dark:text-white">{data.recipientSignature}</span>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const currentStageIndex = getStageIndex(currentStage);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Auction Progress
      </h3>
      
      {/* Stage Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          {stages.map((stage, index) => (
            <div key={stage.id} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                index <= currentStageIndex
                  ? `bg-${stage.color}-500 text-white`
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
              }`}>
                {index < currentStageIndex ? '✓' : index + 1}
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-center">
                {stage.name}
              </span>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 via-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentStageIndex + 1) / stages.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Current Stage Details */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
            <span className="text-2xl">{stages[currentStageIndex]?.icon}</span>
                  <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                {stages[currentStageIndex]?.name}
                    </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stages[currentStageIndex]?.description}
                    </p>
                  </div>
                </div>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStageColor(stages[currentStageIndex]?.color)}`}>
            Current Stage
          </span>
              </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          {renderStageContent(stages[currentStageIndex])}
        </div>
              </div>

      {/* Stage Actions */}
      {stages[currentStageIndex]?.canUpdate && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 dark:text-white">Stage Actions</h4>
          <div className="flex flex-wrap gap-2">
        {stages.map((stage, index) => {
              if (index <= currentStageIndex + 1 && stage.canUpdate) {
                return (
                  <button
                    key={stage.id}
                    onClick={() => handleStageUpdate(stage.id)}
                    disabled={updating || index > currentStageIndex + 1}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      index === currentStageIndex + 1
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : index === currentStageIndex
                        ? 'bg-gray-600 text-white cursor-not-allowed'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {updating ? 'Updating...' : 
                     index === currentStageIndex + 1 ? `Move to ${stage.name}` :
                     index === currentStageIndex ? 'Current Stage' :
                     'Completed'}
                  </button>
                );
              }
              return null;
        })}
      </div>
        </div>
      )}

      {/* All Stages Overview */}
      <div className="mt-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">All Stages</h4>
          <div className="space-y-3">
          {stages.map((stage, index) => (
            <div
              key={stage.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                index === currentStageIndex
                  ? 'border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20'
                  : index < currentStageIndex
                  ? 'border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
              }`}
            >
                <div className="flex items-center space-x-3">
                <span className="text-lg">{stage.icon}</span>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{stage.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stage.description}</div>
          </div>
        </div>
              <div className="text-right">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  index < currentStageIndex
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                    : index === currentStageIndex
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                }`}>
                  {index < currentStageIndex ? 'Completed' :
                   index === currentStageIndex ? 'Current' : 'Pending'}
                </span>
                {stageData[stage.id]?.startTime && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(stageData[stage.id].startTime).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuctionStages;