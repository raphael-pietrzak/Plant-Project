import { apiClient } from './apiClient';

export interface Preference {
  key: string;
  value: string | number | boolean;
}

export type PreferencesMap = Record<string, string | number | boolean>;

export const DEFAULT_PREFERENCES = {
  'notifications.humidity': true,
  'notifications.temperature': true,
  'thresholds.humidity.min': 40,
  'thresholds.sunlight.min': 60,
  'thresholds.temperature.ideal': 22
};

export const preferenceService = {
  getAllPreferences: async (): Promise<PreferencesMap> => {
    try {
      return await apiClient.get<PreferencesMap>('/preferences');
    } catch (error) {
      console.error('Error fetching preferences, using defaults:', error);
      return DEFAULT_PREFERENCES;
    }
  },

  getPreferenceByKey: async (key: string): Promise<Preference> => {
    return await apiClient.get<Preference>(`/preferences/${key}`);
  },

  updatePreference: async (key: string, value: string | number | boolean): Promise<Preference> => {
    return await apiClient.put<Preference>(`/preferences/${key}`, { value });
  },

  createOrUpdatePreference: async (key: string, value: string | number | boolean): Promise<Preference> => {
    return await apiClient.post<Preference>('/preferences', { key, value });
  }
};
