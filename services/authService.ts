import axios from "axios";
import { z } from "zod";
import { saveAuthData  } from "@/lib/auth";
 
const FormSchema = z.object({
  email: z
    .string()
    .min(1, "Email obrigatório")
    .email("Email inválido"),
  password: z
    .string()
    .min(1, "Senha obrigatória")
    .min(6, "Mínimo 6 caracteres"),
});
 
export type FormData = z.infer<typeof FormSchema>;

export interface FormErrors {
  email?: string;
  password?: string;
}

export const validateForm = (formData: FormData): FormErrors => {
  const result = FormSchema.safeParse(formData);
  if (result.success) {
    return {};
  }

  const errors: FormErrors = {};
  result.error.issues.forEach((issue) => {
    if (issue.path[0] === "email") {
      errors.email = issue.message;
    } else if (issue.path[0] === "password") {
      errors.password = issue.message;
    }
  });

  return errors;
};

export const signIn = async (
  formData: FormData,
  setIsLoading: (loading: boolean) => void,
  setAuthError: (error: string | null) => void,
  router: { push: (path: string) => void }
) => {
  setIsLoading(true);
  setAuthError(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await axios.post(API_URL + "/auth/signin", formData);
  
    if (response.data.access_token && response.data.refresh_token) {
      localStorage.setItem("refresh_token", response.data.refresh_token);
      localStorage.setItem("expires_in", String(Date.now() + response.data.expires_in * 1000));
 
       saveAuthData({
        token: response.data.access_token,
        user: {
          id: response.data.user.id,
          email: response.data.user.email,
          role: response.data.user.role
        }
       });

      setIsLoading(false);
  
       router.push("/");
    } else {
      setAuthError("Resposta inesperada do servidor");
      setIsLoading(false);
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    setAuthError("Erro de autenticação: Credenciais inválidas");
    setIsLoading(false);
  }
};

export const refreshToken = async (): Promise<string | null> => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const refresh_token = localStorage.getItem("refresh_token");

  if (!refresh_token) return null;

  try {
    const response = await axios.post(API_URL + "/auth/refresh", { refresh_token });
    localStorage.setItem("authToken", response.data.access_token);
    localStorage.setItem("refresh_token", response.data.refresh_token);
    localStorage.setItem("expires_in", String(Date.now() + response.data.expires_in * 1000));

    return response.data.access_token;
  } catch (err) {
    console.error("Erro ao refrescar token", err);
    return null;
  }
};
