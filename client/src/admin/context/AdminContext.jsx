import { createContext, useContext, useEffect, useState } from "react";
import api from "../../api/axios";

const AdminContext = createContext(null);
// eslint-disable-next-line react-refresh/only-export-components
export const useAdmin = () => useContext(AdminContext);

export function AdminProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("soleverse_admin_user") || "null"));
  const [ready, setReady] = useState(() => !localStorage.getItem("soleverse_admin_token"));

  useEffect(() => {
    const token = localStorage.getItem("soleverse_admin_token");
    if (!token) return;
    api.get("/admin/profile").then(({ data }) => setUser(data.data)).catch(() => {
      localStorage.removeItem("soleverse_admin_token");
      localStorage.removeItem("soleverse_admin_user");
      setUser(null);
    }).finally(() => setReady(true));
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    if (data.data.role !== "admin") throw new Error("This account does not have admin access");
    localStorage.setItem("soleverse_admin_token", data.token);
    localStorage.setItem("soleverse_admin_user", JSON.stringify(data.data));
    setUser(data.data);
  };
  const logout = () => { localStorage.removeItem("soleverse_admin_token"); localStorage.removeItem("soleverse_admin_user"); setUser(null); };
  return <AdminContext.Provider value={{ user, ready, login, logout }}>{children}</AdminContext.Provider>;
}
