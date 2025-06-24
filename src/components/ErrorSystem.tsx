import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertCircle, X, RefreshCw } from 'lucide-react';

// ===== Error Context =====

type notificationType = 'user-error' | 'system-critical' | 'info';

interface notificationDetails {
    id: string;
    message: string;
    type: notificationType;
    userAction?: {
        label: string;
        onClick: () => void;
    };
}

interface NotificationContextType {
    notifications: notificationDetails[];
    addNotifications: (error: Omit<notificationDetails, 'id'>) => void;
    removeNotifications: (id: string) => void;
    showModal: (title: string, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useError must be used within an ErrorProvider');
    }
    return context;
};

// ===== Error Display Component =====

const ErrorDisplay: React.FC = () => {
    const { notifications, removeNotifications } = useNotification();

    const criticalErrors = notifications.filter(noti => noti.type === 'system-critical');
    const userErrors = notifications.filter(noti => noti.type === 'user-error');
    const infoMessages = notifications.filter(noti => noti.type === 'info');
    // Auto-dismiss user-recoverable errors after 3 seconds
    useEffect(() => {
        const timers: number[] = [];

        userErrors.forEach((error) => {
            const timer = setTimeout(() => {
                removeNotifications(error.id);
            }, 3000);
            timers.push(timer);
        });
        infoMessages.forEach((error) => {
            const timer = setTimeout(() => {
                removeNotifications(error.id);
            }, 3000);
            timers.push(timer);
        });

        return () => timers.forEach(timer => clearTimeout(timer));
    }, [userErrors, infoMessages, removeNotifications]);

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
                                onClick={() => criticalErrors.forEach(error => removeNotifications(error.id))}
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
                                onClick={() => criticalErrors.forEach(error => removeNotifications(error.id))}
                                className="btn btn-outline flex-1"
                            >
                                Dismiss
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* User Recoverable Errors Banner */}
            {userErrors.length > 0 && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    className="fixed top-4 left-4 right-4 z-[9998]"
                >
                    {userErrors.map((error) => (
                        <motion.div
                            key={error.id}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-error/40 border border-error/50 rounded-xl p-4 mb-2 flex items-center justify-between"
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
                                            removeNotifications(error.id);
                                        }}
                                        className="btn btn-outline py-1 px-3 text-xs"
                                    >
                                        {error.userAction.label}
                                    </button>
                                )}
                                <button
                                    onClick={() => removeNotifications(error.id)}
                                    className="text-muted hover:text-foreground"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Info Banner */}
            {infoMessages.length > 0 && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    className="fixed top-4 left-4 right-4 z-[9998]"
                >
                    {infoMessages.map((error) => (
                        <motion.div
                            key={error.id}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-warning/40 border border-warning/50 rounded-xl p-4 mb-2 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <AlertCircle className="text-warning" size={20} />
                                <p className="text-sm font-medium">{error.message}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {error.userAction && (
                                    <button
                                        onClick={() => {
                                            error.userAction!.onClick();
                                            removeNotifications(error.id);
                                        }}
                                        className="btn btn-outline py-1 px-3 text-xs"
                                    >
                                        {error.userAction.label}
                                    </button>
                                )}
                                <button
                                    onClick={() => removeNotifications(error.id)}
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
    const [notifications, setNotifications] = useState<notificationDetails[]>([]);

    const addNotifications = useCallback((error: Omit<notificationDetails, 'id'>) => {
        const id = Math.random().toString(36).substring(7);
        const newError = { id, ...error };
        setNotifications(prevErrors => [...prevErrors, newError]);
    }, []);

    const removeNotifications = useCallback((id: string) => {
        setNotifications(prevErrors => prevErrors.filter(error => error.id !== id));
    }, []);

    const showModal = useCallback((title: string, message: string) => {
        alert(`${title}: ${message}`);
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, addNotifications, removeNotifications, showModal }}>
            {children}
            <ErrorDisplay />
        </NotificationContext.Provider>
    );
};
