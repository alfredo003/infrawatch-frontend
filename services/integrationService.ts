import api from "../lib/api";

export interface Integration {
  id?: string;
  token: string;
  cod_agent: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  latitude: string | null;
  longitude: string | null;
  dateTime: Date;
  type: string;
}

export const listAllIntegration = async (): Promise<Integration[]> => {
  try {
    const systemsRes = await api.get("/integrations");
    const systems: Integration[] = systemsRes.data.data;
    return systems;
  } catch (error) {
    console.error("Erro ao buscar Integration:", error);
    throw error;
  }
};

export async function handleCreateIntegration(
  formData: {
    id_type: string;
    agent_token?: string;
    api_token?: string;
    api_url?: string;
    auth_token?: string;
  },
  setIsLoading: (loading: boolean) => void,
  setError: (error: string | null) => void
) {
  setIsLoading(true); 
  try {
    await api.post("/integrations", formData);
    setIsLoading(false);
  } catch (err) {
    setError("Falha ao criar integração");
    setIsLoading(false);
    throw err;
  }
}
  
export async function handleDeleteIntegration(
  id: string,
  setIsLoading: (loading: boolean) => void,
  setError: (error: string | null) => void
) {
  setIsLoading(true);
  try {
    await api.delete(`/integrations/${id}`);
    setIsLoading(false);
  } catch (err) {
    setError("Falha ao deletar integração");
    setIsLoading(false);
    throw err;
  }
}
