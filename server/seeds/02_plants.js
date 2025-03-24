const path = require('path');
const fs = require('fs');

// Charger les données depuis le fichier plants.json
const loadPlantsData = () => {
  const filePath = path.join(__dirname, '..', 'data', 'plants.json');
  const rawData = fs.readFileSync(filePath);
  return JSON.parse(rawData);
};

exports.seed = async function(knex) {
  // Extraire les plantes (non les mesures)
  const plantsData = loadPlantsData();
  const plantEntries = plantsData.plants
    .filter(plant => !plant.device_id)
    .map(plant => ({
      id: plant.id,
      name: plant.name,
      species: plant.category,
      location: 'Intérieur',
      waterFrequency: 7, // valeur par défaut d'une semaine
      lastWatered: new Date(),
      image_url: "https://media.istockphoto.com/id/469538141/fr/photo/jeune-plant.jpg?s=612x612&w=0&k=20&c=YusPoy6PHk7ai5y4iMzgx_RpVJjcmvyVelmfUBkUSKk=",
      device_id: 'ESP8266_1' // Par défaut, on associe les plantes au capteur existant
    }));

  // Vider la table des plantes
  await knex('plants').del();
  
  // Insérer les données des plantes
  if (plantEntries.length > 0) {
    await knex('plants').insert(plantEntries);
    console.log(`${plantEntries.length} plantes insérées`);
  }
};
