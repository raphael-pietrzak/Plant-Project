const path = require('path');
const fs = require('fs');

// Charger les données depuis le fichier preferences.json
const loadPreferencesData = () => {
  const filePath = path.join(__dirname, '..', 'data', 'preferences.json');
  const rawData = fs.readFileSync(filePath);
  return JSON.parse(rawData);
};

exports.seed = async function(knex) {
  const preferencesData = loadPreferencesData();
  
  // Créer un objet de préférence conforme à notre schéma
  const preferenceEntry = {
    notificationsEnabled: preferencesData.notifications.humidityAlerts || preferencesData.notifications.temperatureAlerts,
    darkMode: false, // Valeur par défaut
    measurementUnit: 'metric', // Valeur par défaut
    language: 'fr' // Valeur par défaut
  };

  // Vider la table des préférences
  await knex('preferences').del();
  
  // Insérer les données des préférences
  await knex('preferences').insert(preferenceEntry);
  console.log('Préférences utilisateur insérées');
};
