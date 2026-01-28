# Database Schema for OnlyFarmers

## Collections

### Users Collection
```javascript
{
  id: "string", // Auto-generated
  email: "string",
  password: "string", // Hashed
  firstName: "string",
  lastName: "string",
  userType: "farmer" | "buyer" | "farmer_admin" | "super_admin" | "transporter",
  phone: "string",
  location: "string",
  createdAt: "timestamp",
  updatedAt: "timestamp",
  isActive: "boolean",
  profile: {
    companyName: "string",
    businessType: "string",
    annualTurnover: "string",
    description: "string",
    kycStatus: "pending" | "approved" | "rejected",
    kycDocuments: {
      panCard: "uploaded" | "pending",
      aadharCard: "uploaded" | "pending",
      businessLicense: "uploaded" | "pending",
      bankStatement: "uploaded" | "pending"
    }
  }
}
```

### Auctions Collection
```javascript
{
  id: "string", // Auto-generated
  farmerId: "string", // Reference to Users
  productName: "string",
  category: "string",
  quantity: "number",
  unit: "string", // kg, tons, pieces, etc.
  basePrice: "number",
  currentBid: "number",
  minIncrement: "number",
  startDate: "timestamp",
  endDate: "timestamp",
  status: "draft" | "active" | "completed" | "cancelled",
  stage: "bidding" | "harvesting" | "loading" | "billing" | "in_transit" | "delivery" | "completed",
  stageDetails: {
    bidding: {
      startTime: "timestamp",
      endTime: "timestamp",
      totalBids: "number",
      highestBid: "number",
      highestBidder: "string" // User ID
    },
    harvesting: {
      startTime: "timestamp",
      completionTime: "timestamp",
      farmerNotes: "string",
      photos: ["string"], // Array of photo URLs
      isReady: "boolean"
    },
    loading: {
      startTime: "timestamp",
      completionTime: "timestamp",
      transportDetails: {
        vehicleType: "string",
        vehicleNumber: "string",
        driverName: "string",
        driverPhone: "string",
        estimatedArrival: "timestamp"
      },
      loadingPhotos: ["string"]
    },
    billing: {
      startTime: "timestamp",
      completionTime: "timestamp",
      invoiceNumber: "string",
      invoiceAmount: "number",
      invoiceDetails: {
        productCost: "number",
        transportCost: "number",
        taxes: "number",
        total: "number"
      },
      invoiceUrl: "string"
    },
    inTransit: {
      startTime: "timestamp",
      completionTime: "timestamp",
      trackingUpdates: [{
        timestamp: "timestamp",
        location: "string",
        status: "string",
        notes: "string"
      }],
      currentLocation: "string",
      estimatedDelivery: "timestamp"
    },
    delivery: {
      startTime: "timestamp",
      completionTime: "timestamp",
      deliveryConfirmation: {
        buyerConfirmed: "boolean",
        confirmationTime: "timestamp",
        buyerNotes: "string",
        deliveryPhotos: ["string"]
      }
    }
  },
  images: ["string"], // Array of image URLs
  description: "string",
  location: "string",
  createdAt: "timestamp",
  updatedAt: "timestamp",
  winner: {
    buyerId: "string",
    finalBid: "number",
    winningTime: "timestamp"
  },
  transportRequest: {
    requested: "boolean",
    requestId: "string", // Reference to TransportRequests
    status: "pending" | "approved" | "rejected" | "assigned" | "in_transit" | "delivered"
  }
}
```

### Bids Collection
```javascript
{
  id: "string", // Auto-generated
  auctionId: "string", // Reference to Auctions
  buyerId: "string", // Reference to Users
  bidAmount: "number",
  bidTime: "timestamp",
  status: "active" | "outbid" | "winning"
}
```

### Payments Collection
```javascript
{
  id: "string", // Auto-generated
  auctionId: "string", // Reference to Auctions
  buyerId: "string", // Reference to Users
  paymentType: "security_deposit" | "part_payment" | "full_payment",
  amount: "number",
  status: "pending" | "completed" | "failed",
  paymentMethod: "string",
  transactionId: "string",
  paymentDate: "timestamp",
  description: "string"
}
```

### TransportRequests Collection
```javascript
{
  id: "string", // Auto-generated
  auctionId: "string", // Reference to Auctions
  buyerId: "string", // Reference to Users (buyer)
  farmerId: "string", // Reference to Users (farmer)
  requestDetails: {
    pickupLocation: "string",
    deliveryLocation: "string",
    deliveryDate: "timestamp",
    specialRequirements: "string",
    preferredVehicleType: "string", // truck, mini_truck, tractor, etc.
    estimatedWeight: "number",
    isUrgent: "boolean"
  },
  status: "pending" | "approved" | "rejected" | "assigned" | "in_transit" | "delivered" | "cancelled",
  assignedTransporter: {
    transporterId: "string", // Reference to Users (transporter)
    transporterName: "string",
    vehicleDetails: {
      vehicleType: "string",
      vehicleNumber: "string",
      capacity: "number"
    },
    driverDetails: {
      name: "string",
      phone: "string",
      licenseNumber: "string"
    },
    assignedAt: "timestamp"
  },
  pricing: {
    baseFare: "number",
    distanceCharge: "number",
    weightCharge: "number",
    urgencyCharge: "number",
    totalAmount: "number",
    currency: "string"
  },
  timeline: {
    requestedAt: "timestamp",
    approvedAt: "timestamp",
    assignedAt: "timestamp",
    pickupAt: "timestamp",
    deliveredAt: "timestamp"
  },
  tracking: {
    currentLocation: "string",
    estimatedDelivery: "timestamp",
    statusUpdates: [{
      timestamp: "timestamp",
      location: "string",
      status: "string",
      notes: "string",
      updatedBy: "string" // User ID
    }]
  },
  feedback: {
    buyerRating: "number", // 1-5 stars
    buyerReview: "string",
    farmerRating: "number",
    farmerReview: "string",
    submittedAt: "timestamp"
  },
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

### Transporters Collection
```javascript
{
  id: "string", // Auto-generated (same as Users.id for transporters)
  userId: "string", // Reference to Users
  businessName: "string",
  businessType: "individual" | "company",
  licenseNumber: "string",
  vehicleFleet: [{
    vehicleId: "string",
    vehicleType: "string",
    vehicleNumber: "string",
    capacity: "number", // in kg
    isAvailable: "boolean",
    currentLocation: "string"
  }],
  serviceAreas: ["string"], // Array of locations
  pricing: {
    baseFare: "number",
    perKmRate: "number",
    perKgRate: "number",
    urgencyCharge: "number"
  },
  ratings: {
    averageRating: "number",
    totalReviews: "number",
    reviews: [{
      userId: "string",
      rating: "number",
      review: "string",
      timestamp: "timestamp"
    }]
  },
  availability: {
    isAvailable: "boolean",
    availableFrom: "timestamp",
    availableUntil: "timestamp",
    currentLocation: "string"
  },
  documents: {
    businessLicense: "string", // URL
    vehicleRC: ["string"], // Array of URLs
    insurance: ["string"], // Array of URLs
    permit: ["string"] // Array of URLs
  },
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

### Tracking Collection
```javascript
{
  id: "string", // Auto-generated
  auctionId: "string", // Reference to Auctions
  stage: "bidding" | "harvesting" | "loading" | "billing" | "in_transit" | "delivery",
  status: "started" | "in_progress" | "completed" | "delayed",
  startTime: "timestamp",
  completionTime: "timestamp",
  notes: "string",
  updatedBy: "string", // User ID
  updatedAt: "timestamp"
}
```

## Stage Flow

### 1. Bidding Stage
- Buyers place live bids
- Real-time bid updates
- Automatic winner selection when time ends

### 2. Harvesting Stage
- Farmer confirms crop/animal ready
- Upload photos and notes
- Mark as ready for loading

### 3. Loading Stage
- Transport arrangements made
- Loading photos uploaded
- Vehicle and driver details recorded

### 4. Billing Stage
- Invoice generated automatically
- Payment details recorded
- Invoice PDF available for download

### 5. In Transit Stage
- Live tracking updates
- Location updates
- Estimated delivery time

### 6. Delivery Stage
- Buyer confirms receipt
- Delivery photos uploaded
- Final confirmation

## Transport Booking Flow

### 1. Transport Request
- Buyer requests transport after winning auction
- Specifies pickup/delivery locations and requirements
- Request sent to farmer for approval

### 2. Farmer Approval
- Farmer reviews transport request
- Can approve, reject, or request modifications
- If approved, request becomes available to transporters

### 3. Transporter Assignment
- Available transporters can view and accept requests
- Farmer/Admin can also manually assign transporters
- Assignment includes pricing and timeline

### 4. Transport Execution
- Transporter updates pickup status
- Real-time tracking during transit
- Delivery confirmation and feedback

## Indexes (Recommended)
- Users: email, userType
- Auctions: farmerId, status, stage, endDate
- Bids: auctionId, buyerId, bidTime
- Payments: auctionId, buyerId, status
- TransportRequests: auctionId, buyerId, status, assignedTransporter.transporterId
- Transporters: userId, serviceAreas, availability.isAvailable
- Tracking: auctionId, stage, updatedAt

## Security Rules (Firestore)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anyone can read auctions
    match /auctions/{auctionId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Authenticated users can read/write bids
    match /bids/{bidId} {
      allow read, write: if request.auth != null;
    }
    
    // Authenticated users can read/write payments
    match /payments/{paymentId} {
      allow read, write: if request.auth != null;
    }
    
    // Transport requests - buyers can create, farmers can approve
    match /transportRequests/{requestId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
        request.auth.uid == resource.data.buyerId;
      allow update: if request.auth != null && 
        (request.auth.uid == resource.data.farmerId || 
         request.auth.uid == resource.data.assignedTransporter.transporterId);
    }
    
    // Transporters - transporters can manage their own data
    match /transporters/{transporterId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.auth.uid == transporterId;
    }
    
    // Authenticated users can read/write tracking
    match /tracking/{trackingId} {
      allow read, write: if request.auth != null;
    }
  }
}
```
