import { useState, useEffect } from "react";
import { getAuthToken, getUser, logout, type User } from "@/lib/auth";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = getAuthToken();
      const userData = getUser();

      if (token && userData) {
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const signOut = () => {
    logout();
    setUser(null);
    setIsAuthenticated(false);
    router.push("/login");
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    signOut,
  };
}