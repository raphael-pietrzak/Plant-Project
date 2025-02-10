import React from 'react';
import { Bell, Cloud, Sun, Droplets, Thermometer } from 'lucide-react';

function Preferences() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Préférences</h1>
      
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
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <span className="text-gray-700">Alertes de température</span>
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
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
              defaultValue="40"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-600">
              <span>0%</span>
              <span>40%</span>
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
              defaultValue="60"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-600">
              <span>0%</span>
              <span>60%</span>
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
              defaultValue="22"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-600">
              <span>15°C</span>
              <span>22°C</span>
              <span>30°C</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Preferences;