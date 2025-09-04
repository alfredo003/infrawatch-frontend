import api from "../lib/api";

export interface DataMetrics {
  system_id: string;
  status: string;
  uptime_percent: number;
  downtime_minutes: number;
  sla_percent: number;
  value: {
    response_time: number | null;
    error_message: string | null;
    output: string | null;
    latency: number | null;
    packetLoss: number | null;
  };
  last_check: string;
}

export interface SystemData {
  id?: string | undefined;
  name: string;
  id_type: string;
  target: string;
  connection_type: string;
  status: string;
  criticality_level: string;
  sla_target: number;
  check_interval: number;
  typeName?: string;
  metric: DataMetrics;
}

export const handleCreateSystem = async (
  formData: SystemData,
  setIsLoading: (loading: boolean) => void,
  setAuthError: (error: string | null) => void,
) => {
  setIsLoading(true);
  setAuthError(null);

  try {
    const response = await api.post("/systems", formData);

    if (response.data.error) {
      setAuthError(response.data.error);
      setIsLoading(false);
      throw new Error(response.data.error);
    }
    setIsLoading(false);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.log("System creation failed:", msg);
    setAuthError("Erro ao registrar sistema: " + msg);
    setIsLoading(false);
  }
};

export const listAllSystems = async (): Promise<SystemData[]> => {
  try {
    const systemsRes = await api.get("/systems");
    const systems: SystemData[] = systemsRes.data.data;

    const typesRes = await api.get("/systems/type/all");
    const types = typesRes.data.data;

    const systemsWithTypeName = systems.map((s) => {
      const type = types.find((t: any) => t.id === s.id_type);
      return {
        ...s,
        typeName: type ? type.name : s.id_type,
      };
    });

    return systemsWithTypeName;
  } catch (error) {
    console.error("Erro ao buscar sistemas:", error);
    throw error;
  }
};
export const listAllSystemsCritical = async (): Promise<SystemData[]> => {
  try {
    const systemsRes = await api.get("/systems");
    const systems: SystemData[] = systemsRes.data.data;

    const typesRes = await api.get("/systems/type/all");
    const types = typesRes.data.data;

    const criticalSystems = systems.filter(
      (s) => s.criticality_level === "critical",
    );

    const systemsWithTypeName = criticalSystems.map((s) => {
      const type = types.find((t: any) => t.id === s.id_type);
      return {
        ...s,
        typeName: type ? type.name : s.id_type,
      };
    });

    return systemsWithTypeName;
  } catch (error) {
    console.error("Erro ao buscar sistemas críticos:", error);
    throw error;
  }
};

export const listAllTypeSystems = async () => {
  try {
    const response = await api.get("/systems/type/all");
    return response.data.data;
  } catch (error) {
    console.error("Erro ao buscar tipo sistemas:", error);
    throw error;
  }
};

export const deleteSystem = async (
  id: string | undefined,
  setIsLoading: (loading: boolean) => void,
) => {
  setIsLoading(true);
  try {
    const response = await api.delete(`/systems/${id}`);
    setIsLoading(false);
    return response.data;
  } catch (error) {
    console.error(`Erro ao deletar sistema com ID ${id}:`, error);
    throw error;
  }
};
