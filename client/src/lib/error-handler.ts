import { toast } from '@/hooks/use-toast';

export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN'
}

export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: Error;
  statusCode?: number;
  timestamp: number;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  
  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  parseError(error: any): AppError {
    const timestamp = Date.now();
    
    // Handle fetch/network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        type: ErrorType.NETWORK,
        message: 'Unable to connect to the server. Please check your internet connection.',
        originalError: error,
        timestamp
      };
    }

    // Handle HTTP errors with status codes
    if (error.message && error.message.includes(':')) {
      const [statusStr, ...messageParts] = error.message.split(': ');
      const statusCode = parseInt(statusStr);
      const message = messageParts.join(': ');

      if (statusCode === 401) {
        return {
          type: ErrorType.AUTHENTICATION,
          message: 'Your session has expired. Please login again.',
          statusCode,
          originalError: error,
          timestamp
        };
      }

      if (statusCode === 403) {
        return {
          type: ErrorType.AUTHORIZATION,
          message: 'You don\'t have permission to perform this action.',
          statusCode,
          originalError: error,
          timestamp
        };
      }

      if (statusCode === 404) {
        return {
          type: ErrorType.NOT_FOUND,
          message: 'The requested resource was not found.',
          statusCode,
          originalError: error,
          timestamp
        };
      }

      if (statusCode >= 400 && statusCode < 500) {
        return {
          type: ErrorType.VALIDATION,
          message: message || 'Invalid request. Please check your input.',
          statusCode,
          originalError: error,
          timestamp
        };
      }

      if (statusCode >= 500) {
        return {
          type: ErrorType.SERVER,
          message: 'Server error. Please try again later.',
          statusCode,
          originalError: error,
          timestamp
        };
      }
    }

    // Handle validation errors
    if (error.message && (error.message.includes('validation') || error.message.includes('required'))) {
      return {
        type: ErrorType.VALIDATION,
        message: error.message,
        originalError: error,
        timestamp
      };
    }

    // Default unknown error
    return {
      type: ErrorType.UNKNOWN,
      message: error.message || 'An unexpected error occurred. Please try again.',
      originalError: error,
      timestamp
    };
  }

  handleError(error: any, options?: { 
    showToast?: boolean; 
    redirectOnAuth?: boolean;
    customMessage?: string;
  }) {
    const appError = this.parseError(error);
    const { showToast = true, redirectOnAuth = true, customMessage } = options || {};

    // Log error in development
    if (import.meta.env.DEV) {
      console.error('Error handled:', appError);
    }

    // TODO: Send to monitoring service in production
    // errorReportingService.captureException(appError);

    // Handle authentication errors
    if (appError.type === ErrorType.AUTHENTICATION && redirectOnAuth) {
      localStorage.removeItem('token');
      window.location.href = '/auth';
      return appError;
    }

    // Show toast notification
    if (showToast) {
      toast({
        title: this.getErrorTitle(appError.type),
        description: customMessage || appError.message,
        variant: 'destructive',
      });
    }

    return appError;
  }

  private getErrorTitle(type: ErrorType): string {
    switch (type) {
      case ErrorType.NETWORK:
        return 'Connection Error';
      case ErrorType.AUTHENTICATION:
        return 'Authentication Required';
      case ErrorType.AUTHORIZATION:
        return 'Access Denied';
      case ErrorType.VALIDATION:
        return 'Invalid Input';
      case ErrorType.NOT_FOUND:
        return 'Not Found';
      case ErrorType.SERVER:
        return 'Server Error';
      default:
        return 'Error';
    }
  }
}

// Convenience function for global use
export const handleError = (error: any, options?: Parameters<ErrorHandler['handleError']>[1]) => {
  return ErrorHandler.getInstance().handleError(error, options);
};

// React Query error handler
export const queryErrorHandler = (error: any) => {
  return handleError(error, { showToast: true });
};