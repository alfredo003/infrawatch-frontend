import axios from "axios";
import { z } from "zod";

const ConnectionType = z.enum(["api", "snmp", "ping", "webhook"]);
const Status = z.enum(["up", "maintenance" ,"down"]);
const levels = z.enum(["low", "medium" ,"high", "critical"]);


export interface SystemData {
  id: string
  username: string
  email: string
  fullName: string
  role: "admin" | "operator" | "viewer"
  status: "active" | "inactive"
  lastLogin: string
  createdAt: string 
  lastLoginIP: string
  department: string
  phone: string
}

export const SystemSchema = z.object({
  name: z.string().min(1, "name cannot be empty"),
  id_type: z.string().min(1, "type cannot be empty"),
  target: z.string().min(1, "target cannot be empty"),
  connection_type: ConnectionType, 
  status: Status,
  criticality_level:levels,  
  sla_target: z
    .number()
    .min(0, "sla_target must be >= 0")
    .max(100, "sla_target must be <= 100"),
  check_interval: z
    .number()
    .refine((n) => Number.isInteger(n) && n > 0, {
      message: "check_interval must be a positive integer (seconds)",
    }),
});
export const typeSystemSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório")
});


export const handleCreateSystem = async (
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
 
export const  ListTypeSystems = async (
  token: string | null, setSystems:any ) => { 

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2000/api";

  try {
    const response = await axios.get(API_URL + "/systems/type/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response);
    if (response.data.error) {
       setSystems(""); 
    } else {
      setSystems(response.data); 
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Erro ao listar sistemas:", msg);
    setSystems("Erro ao carregar sistemas: " + msg);
  }  
};
