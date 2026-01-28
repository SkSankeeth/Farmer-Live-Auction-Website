import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const TransportManagement = ({ userType }) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [transporters, setTransporters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTransporter, setSelectedTransporter] = useState('');
  const [pricing, setPricing] = useState({
    baseFare: '',
    distanceCharge: '',
    weightCharge: '',
    urgencyCharge: '',
    totalAmount: ''
  });

  useEffect(() => {
    fetchTransportRequests();
    if (userType === 'farmer' || userType === 'farmer_admin') {
      fetchTransporters();
    }
  }, [userType]);

  const fetchTransportRequests = async () => {
    try {
      let endpoint = '';
      if (userType === 'farmer') {
        endpoint = `/api/transport/farmer/${user.id}`;
      } else if (userType === 'transporter') {
        endpoint = `/api/transport/transporter/${user.id}`;
      } else if (userType === 'buyer') {
        endpoint = `/api/transport/buyer/${user.id}`;
      }

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error('Error fetching transport requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransporters = async () => {
    try {
      const response = await fetch('/api/transporters?isAvailable=true', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTransporters(data.transporters || []);
      }
    } catch (error) {
      console.error('Error fetching transporters:', error);
    }
  };

  const handleStatusUpdate = async (requestId, status, notes = '') => {
    try {
      const response = await fetch(`/api/transport/request/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, notes })
      });

      if (response.ok) {
        fetchTransportRequests();
        alert(`Request ${status} successfully!`);
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleAssignTransporter = async () => {
    if (!selectedTransporter || !selectedRequest) return;

    try {
      const transporter = transporters.find(t => t.id === selectedTransporter);
      if (!transporter) return;

      const response = await fetch(`/api/transport/request/${selectedRequest.id}/assign`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transporterId: selectedTransporter,
          vehicleDetails: {
            vehicleType: transporter.vehicleFleet[0]?.vehicleType || 'truck',
            vehicleNumber: transporter.vehicleFleet[0]?.vehicleNumber || 'N/A',
            capacity: transporter.vehicleFleet[0]?.capacity || 0
          },
          driverDetails: {
            name: 'Driver Name', // This should come from transporter profile
            phone: 'Driver Phone',
            licenseNumber: 'License Number'
          },
          pricing: {
            baseFare: parseFloat(pricing.baseFare) || 0,
            distanceCharge: parseFloat(pricing.distanceCharge) || 0,
            weightCharge: parseFloat(pricing.weightCharge) || 0,
            urgencyCharge: parseFloat(pricing.urgencyCharge) || 0,
            totalAmount: parseFloat(pricing.totalAmount) || 0,
            currency: 'INR'
          }
        })
      });

      if (response.ok) {
        setShowAssignModal(false);
        setSelectedRequest(null);
        setSelectedTransporter('');
        setPricing({
          baseFare: '',
          distanceCharge: '',
          weightCharge: '',
          urgencyCharge: '',
          totalAmount: ''
        });
        fetchTransportRequests();
        alert('Transporter assigned successfully!');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to assign transporter');
      }
    } catch (error) {
      console.error('Error assigning transporter:', error);
      alert('Failed to assign transporter');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in_transit': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          🚚 Transport Requests ({requests.length})
        </h3>

        {requests.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <p>No transport requests found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Transport Request #{request.id.slice(-8)}
                  </h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                    {request.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Pickup:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{request.requestDetails.pickupLocation}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Delivery:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{request.requestDetails.deliveryLocation}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Vehicle Type:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{request.requestDetails.preferredVehicleType}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Weight:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{request.requestDetails.estimatedWeight} kg</span>
                  </div>
                </div>

                {request.assignedTransporter && (
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h5 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Assigned Transporter</h5>
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                      <p><strong>Name:</strong> {request.assignedTransporter.transporterName}</p>
                      <p><strong>Vehicle:</strong> {request.assignedTransporter.vehicleDetails.vehicleNumber}</p>
                      <p><strong>Driver:</strong> {request.assignedTransporter.driverDetails.name}</p>
                      <p><strong>Phone:</strong> {request.assignedTransporter.driverDetails.phone}</p>
                    </div>
                  </div>
                )}

                {request.pricing && (
                  <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h5 className="font-medium text-green-900 dark:text-green-300 mb-2">Pricing</h5>
                    <div className="text-sm text-green-800 dark:text-green-200">
                      <p><strong>Total Amount:</strong> ₹{request.pricing.totalAmount}</p>
                      <p><strong>Base Fare:</strong> ₹{request.pricing.baseFare}</p>
                      <p><strong>Distance Charge:</strong> ₹{request.pricing.distanceCharge}</p>
                      <p><strong>Weight Charge:</strong> ₹{request.pricing.weightCharge}</p>
                    </div>
                  </div>
                )}

                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  >
                    View Details
                  </button>

                  {userType === 'farmer' && request.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(request.id, 'approved')}
                        className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(request.id, 'rejected')}
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {userType === 'farmer' && request.status === 'approved' && (
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowAssignModal(true);
                      }}
                      className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm"
                    >
                      Assign Transporter
                    </button>
                  )}

                  {userType === 'transporter' && request.status === 'assigned' && (
                    <button
                      onClick={() => handleStatusUpdate(request.id, 'pickup_started')}
                      className="px-3 py-1 bg-orange-600 text-white rounded-md hover:bg-orange-700 text-sm"
                    >
                      Start Pickup
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assign Transporter Modal */}
      {showAssignModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Assign Transporter
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Transporter
                  </label>
                  <select
                    value={selectedTransporter}
                    onChange={(e) => setSelectedTransporter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Choose a transporter</option>
                    {transporters.map((transporter) => (
                      <option key={transporter.id} value={transporter.id}>
                        {transporter.businessName} - {transporter.availability.currentLocation}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Base Fare
                    </label>
                    <input
                      type="number"
                      value={pricing.baseFare}
                      onChange={(e) => setPricing(prev => ({ ...prev, baseFare: e.target.value }))}
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Distance Charge
                    </label>
                    <input
                      type="number"
                      value={pricing.distanceCharge}
                      onChange={(e) => setPricing(prev => ({ ...prev, distanceCharge: e.target.value }))}
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Weight Charge
                    </label>
                    <input
                      type="number"
                      value={pricing.weightCharge}
                      onChange={(e) => setPricing(prev => ({ ...prev, weightCharge: e.target.value }))}
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Urgency Charge
                    </label>
                    <input
                      type="number"
                      value={pricing.urgencyCharge}
                      onChange={(e) => setPricing(prev => ({ ...prev, urgencyCharge: e.target.value }))}
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Total Amount
                  </label>
                  <input
                    type="number"
                    value={pricing.totalAmount}
                    onChange={(e) => setPricing(prev => ({ ...prev, totalAmount: e.target.value }))}
                    className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedRequest(null);
                    setSelectedTransporter('');
                    setPricing({
                      baseFare: '',
                      distanceCharge: '',
                      weightCharge: '',
                      urgencyCharge: '',
                      totalAmount: ''
                    });
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignTransporter}
                  disabled={!selectedTransporter}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportManagement;

