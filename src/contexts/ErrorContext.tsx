import React, { createContext, useState, useContext, useCallback } from 'react';
import { toast } from 'react-toastify';

type ErrorType = 'user-recoverable' | 'system-critical' | 'informational';

interface ErrorDetails {
  id: string;
  message: string;
  type: ErrorType;
  userAction?: {
    label: string;
    onClick: () => void;
  };
}

interface ErrorContextType {
  errors: ErrorDetails[];
  addError: (error: Omit<ErrorDetails, 'id'>) => void;
  removeError: (id: string) => void;
  showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
  showModal: (title: string, message: string) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

export const ErrorProvider = ({ children }: { children: React.ReactNode }) => {
  const [errors, setErrors] = useState<ErrorDetails[]>([]);

  const addError = useCallback((error: Omit<ErrorDetails, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    const newError = { id, ...error };
    setErrors(prevErrors => [...prevErrors, newError]);
  }, []);

  const removeError = useCallback((id: string) => {
    setErrors(prevErrors => prevErrors.filter(error => error.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    toast(message, { type });
  }, []);

  const showModal = useCallback((title: string, message: string) => {
    alert(`${title}: ${message}`);
  }, []);

  return (
    <ErrorContext.Provider value={{ errors, addError, removeError, showToast, showModal }}>
      {children}
    </ErrorContext.Provider>
  );
};
