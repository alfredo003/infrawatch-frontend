import { z } from "zod";

const UserSchema = z.object({
  id: z.string().min(1, "ID do usuário inválido"),
  email: z.string().email("Email do usuário inválido"),
});

export interface User {
  id: string;
  email: string;
}

export interface AuthData {
  token: string;
  user: User;
}

export const saveAuthData = (authData: AuthData) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", authData.token);
    localStorage.setItem("user", JSON.stringify(authData.user));
    document.cookie = `authToken=${authData.token}; path=/; max-age=${
      7 * 24 * 60 * 60
    }; Secure; SameSite=Strict`;
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

export const getAuthTokenFromCookie = (cookies: string): string | null => {
  const cookie = cookies
    .split(";")
    .find((c) => c.trim().startsWith("authToken="));
  return cookie ? cookie.split("=")[1] : null;
};

export const getUser = (): User | null => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("user");
    if (!userData) return null;
    try {
      const parsed = JSON.parse(userData);
      const validated = UserSchema.safeParse(parsed);
      if (validated.success) {
        return validated.data;
      }
      console.error("Dados do usuário inválidos:", validated.error);
      return null;
    } catch (error) {
      console.error("Erro ao parsear dados do usuário:", error);
      return null;
    }
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("expires_in");
    localStorage.removeItem("user");
    document.cookie =
      "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; Secure; SameSite=Strict";
    console.log("Logout executado: localStorage e cookies limpos");
  }
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};
