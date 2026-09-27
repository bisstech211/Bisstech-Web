import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info';

type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastState = {
  toasts: Toast[];
  addToast: (message: string, type: ToastType) => void;
  removeToast: (id: number) => void;
};

export const useToast = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type) => {
    const id = Date.now();
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 5000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export function ToastContainer() {
  const { toasts, removeToast } = useToast();
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border min-w-[280px] max-w-md shadow-lg animate-slide-in ${
            toast.type === 'success' ? 'bg-emerald-900/90 border-emerald-500/30 text-emerald-100' :
            toast.type === 'error' ? 'bg-red-900/90 border-red-500/30 text-red-100' :
            'bg-espresso-900/90 border-white/10 text-white'
          }`}
        >
          <span className="flex-1 text-sm">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 rounded hover:bg-white/10"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}