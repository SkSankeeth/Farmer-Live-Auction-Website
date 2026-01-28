# MongoDB Schema for OnlyFarmers

## 📊 Database Overview

**Database Name:** `onlyfarmers`  
**Connection:** MongoDB Atlas Cloud  
**ODM:** Mongoose  

## 🗄️ Collections

### 1. **farmers** Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, indexed),
  password: String (hashed),
  firstName: String,
  lastName: String,
  phone: String,
  profileImage: String,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  userType: "farmer",
  isActive: Boolean,
  verification: {
    isVerified: Boolean,
    kycStatus: String,
    documents: Object,
    verifiedAt: Date,
    verifiedBy: String
  },
  farmDetails: {
    farmName: String,
    farmSize: Number,
    farmType: String,
    crops: [String],
    certification: [String],
    establishedYear: Number
  },
  businessInfo: {
    businessName: String,
    businessType: String,
    gstNumber: String,
    panNumber: String,
    bankDetails: {
      accountNumber: String,
      ifscCode: String,
      bankName: String,
      accountHolderName: String
    }
  },
  stats: Object,
  createdAt: Date,
  updatedAt: Date,
  lastLoginAt: Date
}
```

### 2. **buyers** Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, indexed),
  password: String (hashed),
  firstName: String,
  lastName: String,
  phone: String,
  profileImage: String,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  userType: "buyer",
  isActive: Boolean,
  verification: {
    isVerified: Boolean,
    kycStatus: String,
    documents: Object,
    verifiedAt: Date,
    verifiedBy: String
  },
  businessInfo: {
    businessName: String,
    businessType: String,
    gstNumber: String,
    panNumber: String,
    businessLicense: String,
    bankDetails: {
      accountNumber: String,
      ifscCode: String,
      bankName: String,
      accountHolderName: String
    }
  },
  preferences: {
    preferredCategories: [String],
    maxDistance: Number,
    preferredPaymentMethods: [String],
    notificationSettings: {
      email: Boolean,
      sms: Boolean,
      push: Boolean
    }
  },
  stats: Object,
  createdAt: Date,
  updatedAt: Date,
  lastLoginAt: Date
}
```

### 3. **admins** Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, indexed),
  password: String (hashed),
  firstName: String,
  lastName: String,
  phone: String,
  profileImage: String,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  userType: "admin",
  isActive: Boolean,
  adminDetails: {
    employeeId: String,
    department: String,
    designation: String,
    permissions: [String],
    reportingManager: String
  },
  stats: Object,
  createdAt: Date,
  updatedAt: Date,
  lastLoginAt: Date
}
```

### 4. **super_admins** Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, indexed),
  password: String (hashed),
  firstName: String,
  lastName: String,
  phone: String,
  profileImage: String,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  userType: "super_admin",
  isActive: Boolean,
  superAdminDetails: {
    employeeId: String,
    designation: String,
    permissions: [String],
    accessLevel: String
  },
  stats: Object,
  createdAt: Date,
  updatedAt: Date,
  lastLoginAt: Date
}
```

### 5. **transporters** Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, indexed),
  firstName: String,
  lastName: String,
  phone: String,
  profileImage: String,
  businessInfo: {
    businessName: String,
    businessType: String,
    gstNumber: String,
    panNumber: String,
    businessLicense: String,
    bankDetails: {
      accountNumber: String,
      ifscCode: String,
      bankName: String,
      accountHolderName: String
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  serviceArea: {
    cities: [String],
    states: [String],
    radius: Number
  },
  vehicleFleet: [{
    vehicleType: String,
    make: String,
    model: String,
    year: Number,
    capacity: Number,
    licensePlate: String,
    rcNumber: String,
    insuranceNumber: String,
    isActive: Boolean
  }],
  drivers: [{
    name: String,
    phone: String,
    licenseNumber: String,
    licenseExpiry: Date,
    isActive: Boolean
  }],
  verification: {
    isVerified: Boolean,
    documents: {
      businessLicense: String,
      vehicleRC: String,
      insurance: String,
      permit: String
    },
    verifiedAt: Date,
    verifiedBy: String
  },
  availability: {
    isAvailable: Boolean,
    workingHours: {
      start: String,
      end: String
    },
    workingDays: [String],
    currentLocation: String
  },
  pricing: {
    baseFare: Number,
    distanceRate: Number,
    weightRate: Number,
    minimumFare: Number
  },
  stats: {
    totalDeliveries: Number,
    completedDeliveries: Number,
    averageRating: Number,
    totalEarnings: Number,
    totalReviews: Number
  },
  userType: "transporter",
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date,
  lastLoginAt: Date
}
```

### 6. **auctions** Collection
```javascript
{
  _id: ObjectId,
  title: String,
  productName: String,
  category: String,
  description: String,
  productDetails: {
    quantity: Number,
    unit: String,
    quality: String,
    grade: String,
    variety: String,
    harvestDate: Date,
    expiryDate: Date,
    storageConditions: String
  },
  pricing: {
    basePrice: Number,
    minIncrement: Number,
    reservePrice: Number,
    currentBid: Number,
    instantBuyPrice: Number,
    currency: String
  },
  images: [String],
  farmerId: String (indexed),
  farmerName: String,
  winnerId: String,
  winnerName: String,
  timeline: {
    startTime: Date,
    endTime: Date,
    biddingStartTime: Date,
    biddingEndTime: Date,
    harvestingStartTime: Date,
    harvestingEndTime: Date,
    loadingStartTime: Date,
    loadingEndTime: Date,
    deliveryStartTime: Date,
    deliveryEndTime: Date
  },
  status: String,
  stage: String,
  stageDetails: {
    bidding: {
      startTime: Date,
      endTime: Date,
      totalBids: Number,
      highestBid: Number,
      bidHistory: [{
        bidderId: String,
        bidderName: String,
        amount: Number,
        timestamp: Date
      }]
    }
  },
  location: {
    farmAddress: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    deliveryRadius: Number,
    deliveryOptions: [String],
    estimatedDeliveryTime: String
  },
  terms: {
    paymentTerms: String,
    deliveryTerms: String,
    returnPolicy: String,
    qualityGuarantee: String
  },
  stats: {
    totalBids: Number,
    totalViews: Number,
    totalWatchers: Number,
    averageBidAmount: Number
  },
  isActive: Boolean,
  isFeatured: Boolean,
  createdAt: Date,
  updatedAt: Date,
  createdBy: String
}
```

### 7. **payments** Collection
```javascript
{
  _id: ObjectId,
  auctionId: String (indexed),
  farmerId: String (indexed),
  buyerId: String (indexed),
  amount: Number,
  commission: Number,
  farmerAmount: Number,
  currency: String,
  paymentMethod: String,
  paymentDetails: {
    transactionId: String,
    gateway: String,
    referenceId: String
  },
  status: String,
  escrowStatus: String,
  paidAt: Date,
  releasedAt: Date,
  disputeStatus: String,
  disputeReason: String,
  disputeInitiatedAt: Date,
  disputeResolvedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 8. **transport** Collection
```javascript
{
  _id: ObjectId,
  requestType: String,
  priority: String,
  farmerId: String (indexed),
  buyerId: String (indexed),
  transporterId: String (indexed),
  farmerContact: {
    name: String,
    phone: String,
    email: String
  },
  buyerContact: {
    name: String,
    phone: String,
    email: String
  },
  pickup: {
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    contactPerson: String,
    contactPhone: String,
    scheduledTime: Date
  },
  delivery: {
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    contactPerson: String,
    contactPhone: String,
    scheduledTime: Date
  },
  cargo: {
    type: String,
    weight: Number,
    volume: Number,
    description: String,
    specialRequirements: String
  },
  vehicleDetails: {
    vehicleType: String,
    capacity: Number,
    licensePlate: String,
    driverName: String,
    driverPhone: String
  },
  pricing: {
    baseFare: Number,
    distanceRate: Number,
    weightRate: Number,
    totalAmount: Number,
    currency: String
  },
  tracking: {
    currentLocation: String,
    estimatedArrival: Date,
    actualArrival: Date,
    status: String,
    updates: [{
      timestamp: Date,
      location: String,
      status: String,
      notes: String
    }]
  },
  assignedTransporter: {
    transporterId: String,
    transporterName: String,
    vehicleDetails: Object,
    assignedAt: Date
  },
  feedback: {
    rating: Number,
    comment: String,
    submittedAt: Date,
    submittedBy: String
  },
  status: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date,
  createdBy: String
}
```

## 🔍 Indexes

### Automatic Indexes
- `email` (unique) on all user collections
- `farmerId` on auctions and transport
- `buyerId` on payments and transport
- `auctionId` on payments and transport
- `transporterId` on transport

### Recommended Additional Indexes
```javascript
// Compound indexes for common queries
db.auctions.createIndex({ "status": 1, "stage": 1, "createdAt": -1 })
db.payments.createIndex({ "buyerId": 1, "status": 1, "createdAt": -1 })
db.transport.createIndex({ "status": 1, "priority": 1, "createdAt": -1 })
db.transport.createIndex({ "farmerId": 1, "buyerId": 1 })
```

## 📊 Data Relationships

```
farmers (1) ──→ (N) auctions
buyers (1) ──→ (N) payments
buyers (1) ──→ (N) transport
auctions (1) ──→ (1) payments
auctions (1) ──→ (1) transport
transporters (1) ──→ (N) transport
```

## 🔒 Security Considerations

1. **Password Hashing**: bcrypt with 12 salt rounds
2. **Input Validation**: Mongoose schema validation
3. **Access Control**: JWT-based authentication
4. **Data Sanitization**: Automatic with Mongoose
5. **Index Optimization**: Prevents slow queries

## 📈 Performance Notes

- **Connection Pooling**: 10 connections by default
- **Query Optimization**: Use lean() for read-only operations
- **Index Usage**: Monitor with MongoDB Compass
- **Aggregation**: Use for complex analytics queries

---

**Schema Version:** 1.0  
**Last Updated:** December 2024  
**MongoDB Version:** 7.0+




