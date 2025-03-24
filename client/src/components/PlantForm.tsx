import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { plantService, Plant, PlantInput } from '../api/plantService';
import { measurementService, Device } from '../api/measurementService';

function PlantForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [plant, setPlant] = useState<PlantInput>({
    name: '',
    species: '',
    device_id: '',
    image_url: '',
    location: ''
  });

  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Charger les appareils disponibles
        const devicesData = await measurementService.getDevices();
        setDevices(devicesData);
        
        // Si on est en mode édition, charger les données de la plante
        if (isEditing) {
          const plantData = await plantService.getPlantById(parseInt(id as string));
          setPlant({
            name: plantData.name,
            species: plantData.species,
            device_id: plantData.device_id || '',
            image_url: plantData.image_url || '',
            location: plantData.location || ''
          });
          
          if (plantData.image_url) {
            setImagePreview(plantData.image_url);
          }
        }
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Erreur lors du chargement des données. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPlant({
      ...plant,
      [name]: value
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPlant({
      ...plant,
      image_url: value
    });
    
    if (value) {
      setImagePreview(value);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isEditing) {
        await plantService.updatePlant(parseInt(id as string), plant);
      } else {
        await plantService.createPlant(plant);
      }
      navigate('/');
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement de la plante:', err);
      setError('Erreur lors de l\'enregistrement de la plante. Veuillez réessayer.');
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {isEditing ? 'Modifier la plante' : 'Ajouter une plante'}
      </h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nom de la plante *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={plant.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Ex: Monstera Deliciosa"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="species" className="block text-sm font-medium text-gray-700 mb-1">
            Espèce *
          </label>
          <input
            type="text"
            id="species"
            name="species"
            value={plant.species}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Ex: Tropical"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Emplacement
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={plant.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Ex: Salon, près de la fenêtre"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="device_id" className="block text-sm font-medium text-gray-700 mb-1">
            Appareil connecté
          </label>
          <select
            id="device_id"
            name="device_id"
            value={plant.device_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Aucun appareil</option>
            {devices.map(device => (
              <option key={device.device_id} value={device.device_id}>
                {device.name} ({device.device_id}) - Dernière connexion: {new Date(device.last_seen).toLocaleString()}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-6">
          <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
            URL de l'image
          </label>
          <input
            type="url"
            id="image_url"
            name="image_url"
            value={plant.image_url}
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="https://exemple.com/image.jpg"
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Aperçu"
                className="w-40 h-40 object-cover rounded-md border border-gray-300"
                onError={() => setImagePreview(null)}
              />
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md disabled:bg-emerald-400"
          >
            {loading ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Ajouter'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PlantForm;
