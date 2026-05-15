"use client";
/**
 * Toast notification system.
 *
 * Usage:
 *   1. Wrap your app in <ToastProvider> (already done in root layout)
 *   2. Call useToast() in any client component:
 *      const { toast } = useToast();
 *      toast.success("Escrow funded successfully!");
 *      toast.error("Failed to connect wallet.");
 *      toast.info("Waiting for Freighter confirmation...");
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useId,
  useReducer,
  useRef,
} from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
export type ToastVariant = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

type ToastAction =
  | { type: "ADD"; payload: ToastItem }
  | { type: "REMOVE"; id: string };

// ── Reducer ───────────────────────────────────────────────────────────────────
function toastReducer(state: ToastItem[], action: ToastAction): ToastItem[] {
  switch (action.type) {
    case "ADD":
      // Keep max 5 toasts at once
      return [...state.slice(-4), action.payload];
    case "REMOVE":
      return state.filter((t) => t.id !== action.id);
    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────
interface ToastContextValue {
  toasts: ToastItem[];
  addToast: (message: string, variant: ToastVariant) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, dispatch] = useReducer(toastReducer, []);
  const counterRef = useRef(0);

  const addToast = useCallback((message: string, variant: ToastVariant) => {
    const id = `toast-${Date.now()}-${++counterRef.current}`;
    dispatch({ type: "ADD", payload: { id, message, variant } });
    // Auto-dismiss after 4s
    setTimeout(() => dispatch({ type: "REMOVE", id }), 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    dispatch({ type: "REMOVE", id });
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");

  return {
    toast: {
      success: (msg: string) => ctx.addToast(msg, "success"),
      error: (msg: string) => ctx.addToast(msg, "error"),
      info: (msg: string) => ctx.addToast(msg, "info"),
      warning: (msg: string) => ctx.addToast(msg, "warning"),
    },
    dismiss: ctx.removeToast,
  };
}

// ── Toast Container (rendered by provider) ───────────────────────────────────
const VARIANT_STYLES: Record<ToastVariant, { bg: string; icon: string; text: string }> = {
  success: {
    bg: "bg-green-50 border-green-200",
    icon: "bi-check-circle-fill text-green-600",
    text: "text-green-900",
  },
  error: {
    bg: "bg-red-50 border-red-200",
    icon: "bi-x-circle-fill text-red-600",
    text: "text-red-900",
  },
  warning: {
    bg: "bg-yellow-50 border-yellow-200",
    icon: "bi-exclamation-triangle-fill text-yellow-600",
    text: "text-yellow-900",
  },
  info: {
    bg: "bg-blue-50 border-blue-200",
    icon: "bi-info-circle-fill text-blue-600",
    text: "text-blue-900",
  },
};

function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((t) => {
        const s = VARIANT_STYLES[t.variant];
        return (
          <div
            key={t.id}
            role="alert"
            className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-2xl border shadow-lg backdrop-blur-sm animate-fade-in-up ${s.bg}`}
          >
            <i className={`bi ${s.icon} text-lg mt-0.5 flex-shrink-0`} />
            <p className={`flex-1 text-sm font-medium ${s.text}`}>
              {t.message}
            </p>
            <button
              onClick={() => onRemove(t.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 mt-0.5"
              aria-label="Dismiss notification"
            >
              <i className="bi bi-x text-lg" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
