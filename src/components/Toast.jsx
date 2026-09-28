import { useEffect } from "react";

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(onClose, 4000);
    return () => window.clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className={`toast ${toast.type === "error" ? "error" : ""}`} role="status">
      <span className="toast-dot" />
      <span>{toast.message}</span>
    </div>
  );
}
