const path = require('path');
const fs = require('fs');

// Charger les données depuis le fichier plants.json
const loadPlantsData = () => {
  const filePath = path.join(__dirname, '..', 'data', 'plants.json');
  const rawData = fs.readFileSync(filePath);
  return JSON.parse(rawData);
};

exports.seed = async function(knex) {
  // Extraire les IDs de dispositifs uniques des données de plantes
  const plantsData = loadPlantsData();
  const deviceEntries = plantsData.plants
    .filter(plant => plant.device_id)
    .reduce((devices, plant) => {
      if (!devices.some(device => device.device_id === plant.device_id)) {
        devices.push({
          device_id: plant.device_id,
          name: `Capteur ${plant.device_id}`,
          location: 'Intérieur',
          last_seen: plant.timestamp
        });
      }
      return devices;
    }, []);

  // Vider la table des appareils
  await knex('devices').del();
  
  // Insérer les données des appareils
  if (deviceEntries.length > 0) {
    await knex('devices').insert(deviceEntries);
    console.log(`${deviceEntries.length} appareils insérés`);
  }
};
