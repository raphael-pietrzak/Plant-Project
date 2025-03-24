const path = require('path');
const fs = require('fs');

// Charger les données depuis le fichier plants.json
const loadPlantsData = () => {
  const filePath = path.join(__dirname, '..', 'data', 'plants.json');
  const rawData = fs.readFileSync(filePath);
  return JSON.parse(rawData);
};

exports.seed = async function(knex) {
  // Extraire les mesures de capteurs
  const plantsData = loadPlantsData();
  const measurementEntries = plantsData.plants
    .filter(plant => plant.device_id)
    .map(reading => ({
      device_id: reading.device_id,
      temperature: reading.temperature,
      humidity: reading.humidity,
      timestamp: reading.timestamp
      // Remarque: le champ 'light' n'est pas utilisé car il n'existe pas dans le schéma de table
    }));

  // Vider la table des mesures
  await knex('measurements').del();
  
  // Insérer les données des mesures
  if (measurementEntries.length > 0) {
    await knex('measurements').insert(measurementEntries);
    console.log(`${measurementEntries.length} mesures insérées`);
  }
};
