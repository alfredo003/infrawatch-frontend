import axios from "axios";
import { z } from "zod";
import { saveAuthData, type AuthData } from "@/lib/auth";

 
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

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2000/api";
 
  try {
    const response = await axios.post(API_URL + "/auth/signin", formData);

    console.log(response);
    if (response.data.error) {
      setAuthError(response.data.error);
      setIsLoading(false);
      return;
    } else if (response.data.token && response.data.user) {
      saveAuthData({
        token: response.data.token,
        user: {
          id: response.data.user.id,
          email: response.data.user.email,
        },
      });
      setIsLoading(false);
      router.push("/");
    } else {
      console.log("Resposta inesperada:", response.data);
      setIsLoading(false);
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.log("Login failed:", msg);
    setAuthError("Erro de autenticação: " + msg);
    setIsLoading(false);
  }
};