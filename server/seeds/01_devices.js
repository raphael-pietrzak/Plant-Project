const path = require('path');
const fs = require('fs');

exports.seed = async function(knex) {
  // Données des appareils directement au format de la base de données
  const deviceEntries = [
    {
      device_id: 'ESP8266_1',
      name: 'Capteur ESP8266_1',
      location: 'Intérieur',
      last_seen: new Date()
    }
  ];

  // Vider la table des appareils
  await knex('devices').del();
  
  // Insérer les données des appareils
  await knex('devices').insert(deviceEntries);
  console.log(`${deviceEntries.length} appareils insérés`);
};
