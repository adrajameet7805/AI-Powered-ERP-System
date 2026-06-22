import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import api from "@/services/api";

export type AppRole = "Admin" | "Manager" | "Employee";

export interface User {
  id?: string;
  email: string;
  user_metadata?: { full_name?: string };
}

interface AuthContextValue {
  user: User | null;
  roles: AppRole[];
  loading: boolean;
  signOut: () => Promise<void>;
  hasRole: (role: AppRole) => boolean;
  signIn: (token: string, userData: User, userRole: AppRole) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("user");
    const storedRoles = localStorage.getItem("roles");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      if (storedRoles) setRoles(JSON.parse(storedRoles));
    }
    setLoading(false);
  }, []);

  async function signOut() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("roles");
    setUser(null);
    setRoles([]);
  }

  function signIn(token: string, userData: User, userRole: AppRole) {
    localStorage.setItem("access_token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("roles", JSON.stringify([userRole]));
    setUser(userData);
    setRoles([userRole]);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        roles,
        loading,
        signOut,
        signIn,
        hasRole: (r) => roles.includes(r),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
