import { createContext, useContext, useState } from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
const ToastContext = createContext(null);
// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(ToastContext);
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const show = (message, type = "success") => { setToast({ message, type }); window.setTimeout(() => setToast(null), 3500); };
  return <ToastContext.Provider value={show}>{children}{toast && <div className={`fixed right-5 top-5 z-[100] flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-xl ${toast.type === "error" ? "bg-rose-600" : "bg-slate-900"}`}>{toast.type === "error" ? <FiXCircle /> : <FiCheckCircle />}{toast.message}</div>}</ToastContext.Provider>;
}
