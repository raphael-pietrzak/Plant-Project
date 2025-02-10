import { Droplets, Sun, Thermometer } from 'lucide-react';
import PlantCard from './PlantCard';

const plants = [
  {
    id: 1,
    name: 'Monstera Deliciosa',
    category: 'Tropical',
    image: 'assets/plants/plant-01.jpg',
    humidity: 75,
    sunlight: 60,
    temperature: 22,
  },
  {
    id: 2,
    name: 'Ficus Lyrata',
    category: 'Arbres d\'intérieur',
    image: 'assets/plants/plant-02.jpg',
    humidity: 65,
    sunlight: 80,
    temperature: 24,
  },
];

function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Tableau de bord</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="bg-blue-100 p-3 rounded-full">
            <Droplets className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">Humidité moyenne</p>
            <p className="text-2xl font-semibold text-gray-800">70%</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="bg-yellow-100 p-3 rounded-full">
            <Sun className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">Ensoleillement moyen</p>
            <p className="text-2xl font-semibold text-gray-800">65%</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="bg-red-100 p-3 rounded-full">
            <Thermometer className="h-6 w-6 text-red-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">Température moyenne</p>
            <p className="text-2xl font-semibold text-gray-800">23°C</p>
          </div>
        </div>
      </div>

      {/* Plants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plants.map((plant) => (
          <PlantCard key={plant.id} plant={plant} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;