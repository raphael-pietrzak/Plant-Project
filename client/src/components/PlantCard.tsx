import React from 'react';
import { Droplets, Sun, Thermometer } from 'lucide-react';

interface PlantCardProps {
  plant: {
    name: string;
    category: string;
    image: string;
    humidity: number;
    sunlight: number;
    temperature: number;
  };
}

function PlantCard({ plant }: PlantCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <img
        src={plant.image}
        alt={plant.name}
        className="w-24"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{plant.name}</h3>
        <p className="text-sm text-gray-600 mb-4">{plant.category}</p>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <Droplets className="h-5 w-5 text-blue-600 mr-2" />
            <div className="flex-1">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-blue-600 rounded-full"
                  style={{ width: `${plant.humidity}%` }}
                />
              </div>
            </div>
            <span className="ml-2 text-sm text-gray-600">{plant.humidity}%</span>
          </div>
          
          <div className="flex items-center">
            <Sun className="h-5 w-5 text-yellow-600 mr-2" />
            <div className="flex-1">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-yellow-600 rounded-full"
                  style={{ width: `${plant.sunlight}%` }}
                />
              </div>
            </div>
            <span className="ml-2 text-sm text-gray-600">{plant.sunlight}%</span>
          </div>
          
          <div className="flex items-center">
            <Thermometer className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-sm text-gray-600">{plant.temperature}°C</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlantCard;