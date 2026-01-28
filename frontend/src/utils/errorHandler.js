// Enhanced error handling utilities
import { useState, useEffect } from 'react';

export class AppError extends Error {
  constructor(message, code, statusCode = 500, details = null) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

export class ValidationError extends AppError {
  constructor(message, field, value = null) {
    super(message, 'VALIDATION_ERROR', 400, { field, value });
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 'AUTH_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, 'AUTHZ_ERROR', 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 'CONFLICT', 409);
    this.name = 'ConflictError';
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Network error') {
    super(message, 'NETWORK_ERROR', 0);
    this.name = 'NetworkError';
  }
}

// Error handling middleware for API calls
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error instanceof AppError) {
    return error;
  }
  
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return new NetworkError('Unable to connect to server. Please check your internet connection.');
  }
  
  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return new ValidationError(data.message || 'Invalid request data');
      case 401:
        return new AuthenticationError(data.message || 'Authentication required');
      case 403:
        return new AuthorizationError(data.message || 'Insufficient permissions');
      case 404:
        return new NotFoundError(data.message || 'Resource not found');
      case 409:
        return new ConflictError(data.message || 'Resource conflict');
      case 422:
        return new ValidationError(data.message || 'Validation failed', null, data.errors);
      case 500:
        return new AppError(data.message || 'Internal server error', 'SERVER_ERROR', 500);
      default:
        return new AppError(data.message || 'An error occurred', 'UNKNOWN_ERROR', status);
    }
  }
  
  if (error.request) {
    return new NetworkError('No response from server. Please try again.');
  }
  
  return new AppError(error.message || 'An unexpected error occurred', 'UNKNOWN_ERROR');
};

// Error boundary hook for React components
export const useErrorBoundary = () => {
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const handleError = (event) => {
      setError(new AppError(event.error?.message || 'An error occurred', 'RUNTIME_ERROR'));
    };
    
    const handleUnhandledRejection = (event) => {
      setError(new AppError(event.reason?.message || 'An error occurred', 'PROMISE_REJECTION'));
    };
    
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
  
  return { error, setError };
};

// Toast notification system for errors
export const showErrorToast = (error, toast) => {
  const errorMessage = error instanceof AppError ? error.message : 'An error occurred';
  const errorType = error instanceof AppError ? error.code : 'UNKNOWN_ERROR';
  
  toast({
    title: 'Error',
    description: errorMessage,
    status: 'error',
    duration: 5000,
    isClosable: true,
    position: 'top-right'
  });
};

// Retry mechanism for failed API calls
export const withRetry = async (apiCall, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      
      // Don't retry for certain error types
      if (error instanceof ValidationError || 
          error instanceof AuthenticationError || 
          error instanceof AuthorizationError) {
        throw error;
      }
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }
  
  throw lastError;
};

// Error logging utility
export const logError = (error, context = {}) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    error: {
      name: error.name,
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      stack: error.stack
    },
    context,
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Log:', errorLog);
  }
  
  // Send to error tracking service in production
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Sentry, LogRocket, etc.
    // errorTrackingService.captureException(error, { extra: context });
  }
};

// Form error handling
export const handleFormError = (error, setFieldError, setGeneralError) => {
  if (error instanceof ValidationError && error.details?.field) {
    setFieldError(error.details.field, error.message);
  } else if (error.details?.errors) {
    // Handle multiple field errors
    Object.keys(error.details.errors).forEach(field => {
      setFieldError(field, error.details.errors[field]);
    });
  } else {
    setGeneralError(error.message);
  }
};

// Network status monitoring
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOnline;
};

// Offline error message
export const getOfflineErrorMessage = () => ({
  type: 'warning',
  title: 'Offline',
  message: "You're currently offline. Some features may not be available.",
  icon: 'warning'
});

// Error recovery utilities
export const recoverFromError = (error, retryCallback) => {
  if (error instanceof NetworkError) {
    return {
      canRetry: true,
      message: 'Network error. Check your connection and try again.',
      action: retryCallback
    };
  }
  
  if (error instanceof ValidationError) {
    return {
      canRetry: false,
      message: 'Please check your input and try again.',
      action: null
    };
  }
  
  if (error instanceof AuthenticationError) {
    return {
      canRetry: false,
      message: 'Please log in again.',
      action: () => window.location.href = '/login'
    };
  }
  
  return {
    canRetry: true,
    message: 'An error occurred. Please try again.',
    action: retryCallback
  };
};
