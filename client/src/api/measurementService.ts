import { apiClient } from './apiClient';

export interface Measurement {
  id: number;
  device_id: string;
  temperature: number;
  humidity: number;
  timestamp: string;
}

export interface Device {
  id: number;
  device_id: string;
  name: string;
  location?: string;
  last_seen: string;
}

export const measurementService = {
  getMeasurements: async (deviceId?: string, limit?: number): Promise<Measurement[]> => {
    let endpoint = '/measurements';
    const params = new URLSearchParams();
    
    if (deviceId) params.append('device_id', deviceId);
    if (limit) params.append('limit', limit.toString());
    
    const queryString = params.toString();
    if (queryString) endpoint += `?${queryString}`;
    
    return await apiClient.get<Measurement[]>(endpoint);
  },

  getDevices: async (): Promise<Device[]> => {
    return await apiClient.get<Device[]>('/measurements/devices');
  },

  createMeasurement: async (measurement: Omit<Measurement, 'id' | 'timestamp'>): Promise<{ message: string; measurement_id: number; timestamp: string }> => {
    return await apiClient.post<{ message: string; measurement_id: number; timestamp: string }>('/measurements', measurement);
  },

  // Méthode utilitaire pour obtenir les dernières mesures pour chaque appareil
  getLatestMeasurements: async (): Promise<Record<string, Measurement>> => {
    const measurements = await apiClient.get<Measurement[]>('/measurements');
    const devices = new Map<string, Measurement>();
    
    measurements.forEach(measurement => {
      const existingMeasurement = devices.get(measurement.device_id);
      if (!existingMeasurement || new Date(measurement.timestamp) > new Date(existingMeasurement.timestamp)) {
        devices.set(measurement.device_id, measurement);
      }
    });
    
    return Object.fromEntries(devices.entries());
  }
};
