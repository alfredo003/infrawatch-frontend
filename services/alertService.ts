import api from "@/lib/api"

export interface AlertData{
  id?: string;
  system_id?: string; 
  trigger_condition: string;
  notification_type: "email" | "sms" | "webhook";
  recipient: string;
  sent_at: string | null;  
  company_id?: string; 
}

export const listAllAlerts = async (): Promise<AlertData[]> => {
  try {
    const systemsRes = await api.get("/alerts")
    const systems: AlertData[] = systemsRes.data.data

    return systems;
  } catch (error) {
    console.error("Erro ao buscar sistemas:", error)
    throw error
  }
}