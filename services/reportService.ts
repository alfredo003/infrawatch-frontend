import { ReportData } from '@/interfaces/IReports';
import api from '@/lib/api';


export const getAllReports = async (): Promise<ReportData[]> => {
  try {
    const response = await api.get('/reports');
   const reports: ReportData[] = response.data;

    return reports;
  } catch (error) {
    console.error('Erro ao buscar relatórios:', error);
    throw error;
  }
};


