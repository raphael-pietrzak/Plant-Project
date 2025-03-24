import React from 'react';
import { Droplets, Sun, Thermometer } from 'lucide-react';
import { Plant } from '../api/plantService';
import { Measurement } from '../api/measurementService';

interface PlantCardProps {
  plant: Plant;
  measurement?: Measurement;
  onDelete?: (id: number) => void;
  onClick?: () => void;
}

function PlantCard({ plant, measurement, onDelete, onClick }: PlantCardProps) {
  const defaultImage = "https://via.placeholder.com/150?text=Plante";
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete(plant.id);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]" 
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={plant.image_url || defaultImage}
          alt={plant.name}
          className="w-full h-48 object-cover"
        />
        {onDelete && (
          <button 
            onClick={handleDelete}
            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1"
            aria-label="Supprimer la plante"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{plant.name}</h3>
        <p className="text-sm text-gray-600 mb-4">{plant.species}</p>
        <p className="text-xs text-gray-500 mb-4">{plant.location || 'Aucun emplacement défini'}</p>
        
        {measurement ? (
          <div className="space-y-2">
            <div className="flex items-center">
              <Droplets className="h-5 w-5 text-blue-600 mr-2" />
              <div className="flex-1">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-blue-600 rounded-full"
                    style={{ width: `${measurement.humidity}%` }}
                  />
                </div>
              </div>
              <span className="ml-2 text-sm text-gray-600">{measurement.humidity}%</span>
            </div>
            
            <div className="flex items-center">
              <Thermometer className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-sm text-gray-600">{measurement.temperature}°C</span>
            </div>
            
            <div className="text-xs text-gray-500 mt-2">
              Dernière mise à jour: {new Date(measurement.timestamp).toLocaleString()}
            </div>
          </div>
        ) : plant.device_id ? (
          <div className="py-2 px-3 bg-yellow-100 text-yellow-800 rounded-md text-sm">
            Connecté à l'appareil {plant.device_id} - En attente de données
          </div>
        ) : (
          <div className="py-2 px-3 bg-gray-100 text-gray-600 rounded-md text-sm">
            Aucun appareil connecté
          </div>
        )}
      </div>
    </div>
  );
}

export default PlantCard;