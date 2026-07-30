import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
const AuthContext = createContext(null);
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("soleverse_user") || "null"),
  );
  const [ready, setReady] = useState(
    () => !localStorage.getItem("soleverse_token"),
  );
  useEffect(() => {
    if (!localStorage.getItem("soleverse_token")) return;
    api
      .get("/auth/me")
      .then(({ data }) => setUser(data.data))
      .catch(() => {
        localStorage.removeItem("soleverse_token");
        localStorage.removeItem("soleverse_user");
        setUser(null);
      })
      .finally(() => setReady(true));
  }, []);
  const authenticate = async (path, form) => {
    const { data } = await api.post(path, form);
    localStorage.setItem("soleverse_token", data.token);
    localStorage.setItem("soleverse_user", JSON.stringify(data.data));
    setUser(data.data);
    return data.data;
  };
  const logout = () => {
    localStorage.removeItem("soleverse_token");
    localStorage.removeItem("soleverse_user");
    setUser(null);
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        ready,
        login: (form) => authenticate("/auth/login", form),
        register: (form) => authenticate("/auth/register", form),
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
