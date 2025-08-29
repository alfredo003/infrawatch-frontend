import api from '../lib/api'; 


export interface SystemData {
  id?:string,
  name: string,
  id_type: string,
  target:string,
  connection_type: string,
  status: string,
  criticality_level: string,
  sla_target: number,
  check_interval: number
}
 
  export const handleCreateSystem = async (
    formData: SystemData,
    setIsLoading: (loading: boolean) => void,
    setAuthError: (error: string | null) => void,
    router: { push: (path: string) => void }
  ) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const response = await api.post('/systems', formData);

      if (response.data.error) {
        setAuthError(response.data.error);
        setIsLoading(false);
        return;
      }
      console.log(response.data.system);
      setIsLoading(false);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.log('System creation failed:', msg);
      setAuthError('Erro ao registrar sistema: ' + msg);
      setIsLoading(false);
    }
  };


export const listAllSystems = async () => {
  try {
    const response = await api.get('/systems');
    return response.data.data;
  } catch (error) {
    console.error('Erro ao buscar sistemas:', error);
    throw error;
  }
};

 export const listAllTypeSystems = async () => {
  try {
    const response = await api.get('/systems/type/all');
    return response.data.data;
  } catch (error) {
    console.error('Erro ao buscar tipo sistemas:', error);
    throw error;
  }
};
