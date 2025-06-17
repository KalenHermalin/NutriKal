import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, RefreshCw } from 'lucide-react';

// ===== Error Context =====

type ErrorType = 'user-recoverable' | 'system-critical';

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

// ===== Error Display Component =====

const ErrorDisplay: React.FC = () => {
    const { errors, removeError } = useError();

    const criticalErrors = errors.filter(error => error.type === 'system-critical');
    const userRecoverableErrors = errors.filter(error => error.type === 'user-recoverable');
    // Auto-dismiss user-recoverable errors after 3 seconds
    useEffect(() => {
        const timers: number[] = [];

        userRecoverableErrors.forEach((error) => {
            const timer = setTimeout(() => {
                removeError(error.id);
            }, 3000);
            timers.push(timer);
        });

        return () => timers.forEach(timer => clearTimeout(timer));
    }, [userRecoverableErrors, removeError]);

    return (
        <AnimatePresence>
            {/* Critical Error Modal */}
            {criticalErrors.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-card rounded-2xl p-6 max-w-md w-full border border-error/50"
                    >
                        <div className="flex items-start gap-3 mb-4">
                            <AlertTriangle className="text-error mt-1" size={24} />
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-error mb-2">Critical Error</h3>
                                <div className="space-y-2">
                                    {criticalErrors.map((error) => (
                                        <p key={error.id} className="text-sm">{error.message}</p>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={() => criticalErrors.forEach(error => removeError(error.id))}
                                className="text-muted hover:text-foreground"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => window.location.reload()}
                                className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                            >
                                <RefreshCw size={16} />
                                Reload App
                            </button>
                            <button
                                onClick={() => criticalErrors.forEach(error => removeError(error.id))}
                                className="btn btn-outline flex-1"
                            >
                                Dismiss
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* User Recoverable Errors Banner */}
            {userRecoverableErrors.length > 0 && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    className="fixed top-4 left-4 right-4 z-[9998]"
                >
                    {userRecoverableErrors.map((error) => (
                        <motion.div
                            key={error.id}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-error/10 border border-error/50 rounded-xl p-4 mb-2 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="text-error" size={20} />
                                <p className="text-sm font-medium">{error.message}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {error.userAction && (
                                    <button
                                        onClick={() => {
                                            error.userAction!.onClick();
                                            removeError(error.id);
                                        }}
                                        className="btn btn-outline py-1 px-3 text-xs"
                                    >
                                        {error.userAction.label}
                                    </button>
                                )}
                                <button
                                    onClick={() => removeError(error.id)}
                                    className="text-muted hover:text-foreground"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// ===== Error Provider =====

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [errors, setErrors] = useState<ErrorDetails[]>([]);

    const addError = useCallback((error: Omit<ErrorDetails, 'id'>) => {
        const id = Math.random().toString(36).substring(7);
        const newError = { id, ...error };
        setErrors(prevErrors => [...prevErrors, newError]);
    }, []);

    const removeError = useCallback((id: string) => {
        setErrors(prevErrors => prevErrors.filter(error => error.id !== id));
    }, []);

    const showModal = useCallback((title: string, message: string) => {
        alert(`${title}: ${message}`);
    }, []);

    return (
        <ErrorContext.Provider value={{ errors, addError, removeError, showModal }}>
            {children}
            <ErrorDisplay />
        </ErrorContext.Provider>
    );
};
