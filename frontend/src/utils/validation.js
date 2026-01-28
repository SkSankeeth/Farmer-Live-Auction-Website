// Data validation utilities for Firestore schema compliance

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validatePassword = (password) => {
  return password && password.length >= 8;
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

export const validateNumber = (value, min = 0, max = Infinity) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= min && num <= max;
};

export const validatePositiveNumber = (value) => {
  return validateNumber(value, 0.01);
};

export const validateCoordinates = (coordinates) => {
  if (!coordinates || typeof coordinates !== 'object') return false;
  const { latitude, longitude } = coordinates;
  return validateNumber(latitude, -90, 90) && validateNumber(longitude, -180, 180);
};

// User validation schemas
export const validateFarmer = (data) => {
  const errors = {};
  
  if (!validateRequired(data.firstName)) errors.firstName = 'First name is required';
  if (!validateRequired(data.lastName)) errors.lastName = 'Last name is required';
  if (!validateEmail(data.email)) errors.email = 'Valid email is required';
  if (!validatePassword(data.password)) errors.password = 'Password must be at least 8 characters';
  if (data.phone && !validatePhone(data.phone)) errors.phone = 'Valid phone number is required';
  
  // Address validation
  if (data.address) {
    if (!validateRequired(data.address.street)) errors['address.street'] = 'Street address is required';
    if (!validateRequired(data.address.city)) errors['address.city'] = 'City is required';
    if (!validateRequired(data.address.state)) errors['address.state'] = 'State is required';
    if (!validateRequired(data.address.pincode)) errors['address.pincode'] = 'Pincode is required';
    if (data.address.coordinates && !validateCoordinates(data.address.coordinates)) {
      errors['address.coordinates'] = 'Valid coordinates are required';
    }
  }
  
  // Farm details validation
  if (data.farmDetails) {
    if (!validateRequired(data.farmDetails.farmName)) errors['farmDetails.farmName'] = 'Farm name is required';
    if (!validatePositiveNumber(data.farmDetails.farmSize)) errors['farmDetails.farmSize'] = 'Valid farm size is required';
    if (!validateRequired(data.farmDetails.farmType)) errors['farmDetails.farmType'] = 'Farm type is required';
  }
  
  // Business info validation
  if (data.businessInfo) {
    if (data.businessInfo.gstNumber && data.businessInfo.gstNumber.length !== 15) {
      errors['businessInfo.gstNumber'] = 'GST number must be 15 characters';
    }
    if (data.businessInfo.panNumber && data.businessInfo.panNumber.length !== 10) {
      errors['businessInfo.panNumber'] = 'PAN number must be 10 characters';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateBuyer = (data) => {
  const errors = {};
  
  if (!validateRequired(data.firstName)) errors.firstName = 'First name is required';
  if (!validateRequired(data.lastName)) errors.lastName = 'Last name is required';
  if (!validateEmail(data.email)) errors.email = 'Valid email is required';
  if (!validatePassword(data.password)) errors.password = 'Password must be at least 8 characters';
  if (data.phone && !validatePhone(data.phone)) errors.phone = 'Valid phone number is required';
  
  // Address validation
  if (data.address) {
    if (!validateRequired(data.address.street)) errors['address.street'] = 'Street address is required';
    if (!validateRequired(data.address.city)) errors['address.city'] = 'City is required';
    if (!validateRequired(data.address.state)) errors['address.state'] = 'State is required';
    if (!validateRequired(data.address.pincode)) errors['address.pincode'] = 'Pincode is required';
  }
  
  // Business info validation
  if (data.businessInfo) {
    if (!validateRequired(data.businessInfo.businessName)) errors['businessInfo.businessName'] = 'Business name is required';
    if (!validateRequired(data.businessInfo.businessType)) errors['businessInfo.businessType'] = 'Business type is required';
    if (data.businessInfo.gstNumber && data.businessInfo.gstNumber.length !== 15) {
      errors['businessInfo.gstNumber'] = 'GST number must be 15 characters';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Auction validation schema
export const validateAuction = (data) => {
  const errors = {};
  
  if (!validateRequired(data.productName)) errors.productName = 'Product name is required';
  if (!validateRequired(data.category)) errors.category = 'Category is required';
  if (!validateRequired(data.description)) errors.description = 'Description is required';
  if (!validatePositiveNumber(data.quantity)) errors.quantity = 'Valid quantity is required';
  if (!validateRequired(data.unit)) errors.unit = 'Unit is required';
  if (!validatePositiveNumber(data.basePrice)) errors.basePrice = 'Valid base price is required';
  if (!validatePositiveNumber(data.minIncrement)) errors.minIncrement = 'Valid minimum increment is required';
  if (!validatePositiveNumber(data.duration)) errors.duration = 'Valid duration is required';
  
  // Product details validation
  if (data.productDetails) {
    if (!validateRequired(data.productDetails.quality)) errors['productDetails.quality'] = 'Quality is required';
    if (!validateRequired(data.productDetails.grade)) errors['productDetails.grade'] = 'Grade is required';
  }
  
  // Location validation
  if (data.location) {
    if (!validateRequired(data.location.farmAddress)) errors['location.farmAddress'] = 'Farm address is required';
    if (data.location.coordinates && !validateCoordinates(data.location.coordinates)) {
      errors['location.coordinates'] = 'Valid coordinates are required';
    }
  }
  
  // Images validation
  if (!data.images || data.images.length === 0) {
    errors.images = 'At least one image is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Transport validation schema
export const validateTransportRequest = (data) => {
  const errors = {};
  
  if (!validateRequired(data.auctionId)) errors.auctionId = 'Auction ID is required';
  if (!validateRequired(data.pickup?.address)) errors['pickup.address'] = 'Pickup address is required';
  if (!validateRequired(data.delivery?.address)) errors['delivery.address'] = 'Delivery address is required';
  if (!validateRequired(data.pickup?.scheduledTime)) errors['pickup.scheduledTime'] = 'Pickup time is required';
  if (!validateRequired(data.delivery?.scheduledTime)) errors['delivery.scheduledTime'] = 'Delivery time is required';
  
  // Cargo validation
  if (data.cargo) {
    if (!validatePositiveNumber(data.cargo.weight)) errors['cargo.weight'] = 'Valid weight is required';
    if (!validatePositiveNumber(data.cargo.volume)) errors['cargo.volume'] = 'Valid volume is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Payment validation schema
export const validatePayment = (data) => {
  const errors = {};
  
  if (!validateRequired(data.auctionId)) errors.auctionId = 'Auction ID is required';
  if (!validatePositiveNumber(data.amount)) errors.amount = 'Valid amount is required';
  if (!validateRequired(data.paymentMethod)) errors.paymentMethod = 'Payment method is required';
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Bid validation schema
export const validateBid = (data) => {
  const errors = {};
  
  if (!validateRequired(data.auctionId)) errors.auctionId = 'Auction ID is required';
  if (!validatePositiveNumber(data.bidAmount)) errors.bidAmount = 'Valid bid amount is required';
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Transporter validation schema
export const validateTransporter = (data) => {
  const errors = {};
  
  if (!validateRequired(data.firstName)) errors.firstName = 'First name is required';
  if (!validateRequired(data.lastName)) errors.lastName = 'Last name is required';
  if (!validateEmail(data.email)) errors.email = 'Valid email is required';
  if (!validatePassword(data.password)) errors.password = 'Password must be at least 8 characters';
  if (data.phone && !validatePhone(data.phone)) errors.phone = 'Valid phone number is required';
  
  // Business info validation
  if (data.businessInfo) {
    if (!validateRequired(data.businessInfo.businessName)) errors['businessInfo.businessName'] = 'Business name is required';
    if (!validateRequired(data.businessInfo.licenseNumber)) errors['businessInfo.licenseNumber'] = 'License number is required';
  }
  
  // Service area validation
  if (data.serviceArea) {
    if (!data.serviceArea.cities || data.serviceArea.cities.length === 0) {
      errors['serviceArea.cities'] = 'At least one service city is required';
    }
  }
  
  // Vehicle fleet validation
  if (data.vehicleFleet) {
    if (data.vehicleFleet.length === 0) {
      errors.vehicleFleet = 'At least one vehicle is required';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Generic form validation helper
export const validateForm = (data, schema) => {
  switch (schema) {
    case 'farmer':
      return validateFarmer(data);
    case 'buyer':
      return validateBuyer(data);
    case 'auction':
      return validateAuction(data);
    case 'transport':
      return validateTransportRequest(data);
    case 'payment':
      return validatePayment(data);
    case 'bid':
      return validateBid(data);
    case 'transporter':
      return validateTransporter(data);
    default:
      return { isValid: true, errors: {} };
  }
};

// Sanitize input data
export const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim().replace(/[<>]/g, '');
  }
  if (typeof input === 'object' && input !== null) {
    const sanitized = {};
    for (const key in input) {
      sanitized[key] = sanitizeInput(input[key]);
    }
    return sanitized;
  }
  return input;
};

// Format validation errors for display
export const formatValidationErrors = (errors) => {
  const formatted = {};
  for (const key in errors) {
    if (key.includes('.')) {
      const parts = key.split('.');
      let current = formatted;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) current[parts[i]] = {};
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = errors[key];
    } else {
      formatted[key] = errors[key];
    }
  }
  return formatted;
};






