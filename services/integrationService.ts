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
