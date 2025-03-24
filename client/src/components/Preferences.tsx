import React, { useEffect, useState } from 'react';
import { Bell, Cloud, Sun, Droplets, Thermometer, Save } from 'lucide-react';
import { preferenceService, PreferencesMap, DEFAULT_PREFERENCES } from '../api/preferenceService';

function Preferences() {
  const [preferences, setPreferences] = useState<PreferencesMap>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setLoading(true);
        const prefs = await preferenceService.getAllPreferences();
        setPreferences({
          ...DEFAULT_PREFERENCES,
          ...prefs
        });
      } catch (err) {
        console.error('Erreur lors du chargement des préférences:', err);
        setError('Impossible de charger les préférences. Les valeurs par défaut ont été appliquées.');
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, []);

  const handleToggleChange = async (key: string) => {
    try {
      const newValue = !preferences[key];
      setPreferences({
        ...preferences,
        [key]: newValue
      });
      await preferenceService.updatePreference(key, newValue);
    } catch (err) {
      console.error(`Erreur lors de la mise à jour de la préférence ${key}:`, err);
      setError(`Impossible de mettre à jour la préférence ${key}.`);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleRangeChange = (key: string, value: number) => {
    setPreferences({
      ...preferences,
      [key]: value
    });
  };

  const savePreferences = async () => {
    try {
      setSaving(true);
      
      // Sauvegarder toutes les préférences
      const promises = Object.entries(preferences).map(([key, value]) => 
        preferenceService.updatePreference(key, value)
      );
      
      await Promise.all(promises);
      
      setSaveMessage('Préférences enregistrées avec succès');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement des préférences:', err);
      setError('Impossible d\'enregistrer les préférences.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Préférences</h1>
        <button 
          onClick={savePreferences}
          disabled={saving}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Save className="h-5 w-5 mr-1" />
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {saveMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{saveMessage}</span>
        </div>
      )}
      
      {/* Notifications */}
      <section className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Bell className="h-5 w-5 mr-2 text-emerald-600" />
          Notifications
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <span className="text-gray-700">Alertes d'humidité</span>
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={!!preferences['notifications.humidity']}
                onChange={() => handleToggleChange('notifications.humidity')}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <span className="text-gray-700">Alertes de température</span>
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={!!preferences['notifications.temperature']} 
                onChange={() => handleToggleChange('notifications.temperature')}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>
      </section>

      {/* Seuils */}
      <section className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Cloud className="h-5 w-5 mr-2 text-emerald-600" />
          Seuils d'alerte
        </h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Droplets className="h-4 w-4 mr-1 text-blue-600" />
              Humidité minimale
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={preferences['thresholds.humidity.min'] as number}
              onChange={(e) => handleRangeChange('thresholds.humidity.min', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-600">
              <span>0%</span>
              <span>{preferences['thresholds.humidity.min']}%</span>
              <span>100%</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Sun className="h-4 w-4 mr-1 text-yellow-600" />
              Ensoleillement minimal
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={preferences['thresholds.sunlight.min'] as number}
              onChange={(e) => handleRangeChange('thresholds.sunlight.min', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-600">
              <span>0%</span>
              <span>{preferences['thresholds.sunlight.min']}%</span>
              <span>100%</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Thermometer className="h-4 w-4 mr-1 text-red-600" />
              Température idéale
            </label>
            <input
              type="range"
              min="15"
              max="30"
              value={preferences['thresholds.temperature.ideal'] as number}
              onChange={(e) => handleRangeChange('thresholds.temperature.ideal', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-600">
              <span>15°C</span>
              <span>{preferences['thresholds.temperature.ideal']}°C</span>
              <span>30°C</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Preferences;