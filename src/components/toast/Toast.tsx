import { useEffect } from 'react';

type ToastProps = {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  duration?: number;
};

export const Toast = ({
  message,
  type = 'info',
  onClose,
  duration = 5000,
}: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: 'from-green-600 to-green-700',
    error: 'from-red-600 to-red-700',
    warning: 'from-yellow-600 to-yellow-700',
    info: 'from-blue-600 to-blue-700',
  }[type];

  const icon = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  }[type];

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slideDown">
      <div
        className={`bg-gradient-to-r ${bgColor} text-white px-6 py-4 rounded-xl shadow-2xl border border-white/20 max-w-md flex items-center gap-3`}
      >
        <span className="text-2xl font-f1bold">{icon}</span>
        <p className="font-f1regular text-base">{message}</p>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200 transition-colors"
        >
          ✕
        </button>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -100%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        :global(.animate-slideDown) {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};
