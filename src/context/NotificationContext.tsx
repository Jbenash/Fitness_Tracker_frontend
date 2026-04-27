import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface NotificationContextType {
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  confirm: (options: ConfirmOptions) => void;
}

interface ConfirmOptions {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [confirmOptions, setConfirmOptions] = useState<ConfirmOptions | null>(null);

  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    const id = Math.random().toString(36).substring(7);
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }, []);

  const confirm = useCallback((options: ConfirmOptions) => {
    setConfirmOptions(options);
  }, []);

  const handleConfirm = () => {
    confirmOptions?.onConfirm();
    setConfirmOptions(null);
  };

  const handleCancel = () => {
    confirmOptions?.onCancel?.();
    setConfirmOptions(null);
  };

  return (
    <NotificationContext.Provider value={{ showNotification, confirm }}>
      {children}
      
      {/* Custom Toasts */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              className="pointer-events-auto"
            >
              <GlassToast notification={n} onClose={() => setNotifications((prev) => prev.filter((notif) => notif.id !== n.id))} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Custom Confirm Modal */}
      <AnimatePresence>
        {confirmOptions && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancel}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card w-full max-w-md relative z-10 p-8 border-white/10 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20 mb-2">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">{confirmOptions.title}</h3>
                <p className="text-slate-400 font-medium leading-relaxed">{confirmOptions.message}</p>
                <div className="flex gap-3 w-full mt-6">
                  <button 
                    onClick={handleCancel}
                    className="flex-1 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleConfirm}
                    className="flex-1 px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold shadow-lg shadow-rose-500/20 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </NotificationContext.Provider>
  );
};

const GlassToast = ({ notification, onClose }: { notification: Notification; onClose: () => void }) => {
  const configs = {
    success: { icon: <CheckCircle2 size={18} />, color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5' },
    error: { icon: <AlertCircle size={18} />, color: 'text-rose-400', border: 'border-rose-500/20', bg: 'bg-rose-500/5' },
    info: { icon: <Info size={18} />, color: 'text-indigo-400', border: 'border-indigo-500/20', bg: 'bg-indigo-500/5' }
  };

  const config = configs[notification.type];

  return (
    <div className={`glass-card p-4 min-w-[320px] flex items-center gap-4 border ${config.border} ${config.bg} shadow-xl shadow-black/20`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 ${config.color}`}>
        {config.icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-white leading-tight">{notification.message}</p>
      </div>
      <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
        <X size={16} />
      </button>
    </div>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
};
