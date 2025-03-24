import { apiClient } from './apiClient';

export interface Plant {
  id: number;
  name: string;
  species: string;
  device_id?: string;
  image_url?: string;
  location?: string;
  created_at: string;
  updated_at?: string;
}

export interface PlantInput {
  name: string;
  species: string;
  device_id?: string;
  image_url?: string;
  location?: string;
}

export const plantService = {
  getAllPlants: async (): Promise<Plant[]> => {
    return await apiClient.get<Plant[]>('/plants');
  },

  getPlantById: async (id: number): Promise<Plant> => {
    return await apiClient.get<Plant>(`/plants/${id}`);
  },

  createPlant: async (plant: PlantInput): Promise<Plant> => {
    return await apiClient.post<Plant>('/plants', plant);
  },

  updatePlant: async (id: number, plant: Partial<PlantInput>): Promise<Plant> => {
    return await apiClient.put<Plant>(`/plants/${id}`, plant);
  },

  deletePlant: async (id: number): Promise<{ message: string; plantId: number }> => {
    return await apiClient.delete<{ message: string; plantId: number }>(`/plants/${id}`);
  }
};
