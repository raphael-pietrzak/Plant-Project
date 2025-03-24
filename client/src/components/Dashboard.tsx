import React, { useEffect, useState } from 'react';
import { Droplets, Sun, Thermometer, PlusCircle } from 'lucide-react';
import PlantCard from './PlantCard';
import { plantService, Plant } from '../api/plantService';
import { measurementService, Measurement } from '../api/measurementService';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [measurements, setMeasurements] = useState<Record<string, Measurement>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [averages, setAverages] = useState({
    humidity: 0,
    temperature: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les plantes et les dernières mesures en parallèle
        const [plantsData, latestMeasurements] = await Promise.all([
          plantService.getAllPlants(),
          measurementService.getLatestMeasurements()
        ]);
        
        setPlants(plantsData);
        setMeasurements(latestMeasurements);
        
        // Calculer les moyennes
        if (Object.keys(latestMeasurements).length > 0) {
          const measurementsArray = Object.values(latestMeasurements);
          const avgHumidity = measurementsArray.reduce((sum, m) => sum + m.humidity, 0) / measurementsArray.length;
          const avgTemperature = measurementsArray.reduce((sum, m) => sum + m.temperature, 0) / measurementsArray.length;
          
          setAverages({
            humidity: Math.round(avgHumidity),
            temperature: Math.round(avgTemperature * 10) / 10
          });
        }
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Impossible de charger les données. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Actualiser les données toutes les 60 secondes
    const intervalId = setInterval(fetchData, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleDeletePlant = async (id: number) => {
    try {
      await plantService.deletePlant(id);
      setPlants(plants.filter(plant => plant.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression de la plante:', err);
      setError('Impossible de supprimer la plante. Veuillez réessayer plus tard.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Erreur :</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Tableau de bord</h1>
        <Link to="/plants/add" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center">
          <PlusCircle className="h-5 w-5 mr-1" />
          Ajouter une plante
        </Link>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="bg-blue-100 p-3 rounded-full">
            <Droplets className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">Humidité moyenne</p>
            <p className="text-2xl font-semibold text-gray-800">{averages.humidity}%</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="bg-red-100 p-3 rounded-full">
            <Thermometer className="h-6 w-6 text-red-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">Température moyenne</p>
            <p className="text-2xl font-semibold text-gray-800">{averages.temperature}°C</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="bg-emerald-100 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">Nombre de plantes</p>
            <p className="text-2xl font-semibold text-gray-800">{plants.length}</p>
          </div>
        </div>
      </div>

      {/* Plants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plants.length > 0 ? (
          plants.map((plant) => (
            <PlantCard 
              key={plant.id} 
              plant={plant} 
              measurement={plant.device_id ? measurements[plant.device_id] : undefined}
              onDelete={handleDeletePlant}
              onClick={() => window.location.href = `/plants/${plant.id}`}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Aucune plante trouvée.</p>
            <Link to="/plants/add" className="inline-block mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg">
              Ajouter une plante
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;