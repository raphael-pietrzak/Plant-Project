import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Droplets, Thermometer, Calendar, MapPin, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { plantService, Plant } from '../api/plantService';
import { measurementService, Measurement } from '../api/measurementService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function PlantDetail() {
  const { id } = useParams<{ id: string }>();
  console.log(id);
  const navigate = useNavigate();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          throw new Error('ID de plante manquant');
        }
        
        const plantData = await plantService.getPlantById(parseInt(id));
        console.log(plantData);
        setPlant(plantData);
        
        // Charger les mesures si un appareil est connecté
        if (plantData.device_id) {
          const measurementsData = await measurementService.getMeasurements(plantData.device_id, 50);
          // Trier par date croissante pour l'affichage du graphique
          setMeasurements(measurementsData.sort((a, b) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          ));
        }
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Impossible de charger les détails de la plante.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id]);

  const handleDelete = async () => {
    if (!plant) return;
    
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${plant.name} ?`)) {
      try {
        await plantService.deletePlant(plant.id);
        navigate('/');
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        setError('Impossible de supprimer la plante.');
      }
    }
  };

  // Formater les données pour le graphique
  console.log(measurements);
  const chartData = measurements.map(m => ({
    date: new Date(m.timestamp).toLocaleDateString(),
    time: new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    humidity: m.humidity,
    temperature: m.temperature
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
      </div>
    );
  }

  if (error || !plant) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Erreur :</strong>
        <span className="block sm:inline"> {error || "Plante non trouvée"}</span>
        <div className="mt-4">
          <Link to="/" className="text-red-600 hover:text-red-800 underline">Retour au tableau de bord</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Link to="/" className="mr-4 text-gray-600 hover:text-gray-800">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 flex-grow">{plant.name}</h1>
        <div className="flex space-x-2">
          <Link 
            to={`/plants/edit/${plant.id}`}
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
          >
            <Edit className="h-5 w-5" />
          </Link>
          <button 
            onClick={handleDelete}
            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 mb-4 md:mb-0">
            <img 
              src={plant.image_url || "https://media.istockphoto.com/id/511976070/fr/photo/vert-violet.jpg?s=612x612&w=0&k=20&c=T-ON5NpItAC-nv91zifv_zYr8DsEkDN8hdCLQeb_K3Q="}
              alt={plant.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          <div className="md:w-2/3 md:pl-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800">{plant.species}</h2>
              {plant.location && (
                <p className="text-gray-600 flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {plant.location}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Ajoutée le
                </h3>
                <p className="text-lg font-semibold text-gray-800">
                  {new Date(plant.created_at).toLocaleDateString()}
                </p>
              </div>
              
              {plant.device_id ? (
                <div className="bg-green-50 p-3 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700">Appareil connecté</h3>
                  <p className="text-lg font-semibold text-gray-800">
                    {plant.device_id}
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700">Appareil connecté</h3>
                  <p className="text-gray-600">Aucun appareil</p>
                </div>
              )}
            </div>
            
            {/* Dernières mesures */}
            {measurements.length > 0 && (
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Dernières mesures</h3>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <Droplets className="h-5 w-5 text-blue-600 mr-1" />
                    <span className="text-gray-800 font-medium">
                      {measurements[measurements.length - 1].humidity}%
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Thermometer className="h-5 w-5 text-red-600 mr-1" />
                    <span className="text-gray-800 font-medium">
                      {measurements[measurements.length - 1].temperature}°C
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(measurements[measurements.length - 1].timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Graphique des mesures */}
      {measurements.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Historique des mesures</h2>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  name="Heure"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value, index) => {
                    // Afficher moins de ticks pour la lisibilité
                    return index % 3 === 0 ? value : '';
                  }}
                />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value}${name === 'humidity' ? '%' : '°C'}`, 
                    name === 'humidity' ? 'Humidité' : 'Température'
                  ]}
                  labelFormatter={(index) => {
                    // Vérifier que l'index est valide avant d'accéder aux propriétés
                    if (typeof index === 'number' && chartData[index]) {
                      return `${chartData[index].date} ${chartData[index].time}`;
                    }
                    return 'Données non disponibles';
                  }}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="humidity" 
                  name="Humidité" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 1 }}
                  activeDot={{ r: 5 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="temperature" 
                  name="Température" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ r: 1 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlantDetail;
