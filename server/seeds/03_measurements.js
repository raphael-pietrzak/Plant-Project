const path = require('path');
const fs = require('fs');

exports.seed = async function(knex) {
  // Données des mesures directement au format de la base de données
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const measurementEntries = [
    {
      device_id: 'ESP8266_1',
      temperature: 22,
      humidity: 65,
      timestamp: now
    },
    {
      device_id: 'ESP8266_1',
      temperature: 21,
      humidity: 62,
      timestamp: yesterday
    }
  ];

  // Vider la table des mesures
  await knex('measurements').del();
  
  // Insérer les données des mesures
  await knex('measurements').insert(measurementEntries);
  console.log(`${measurementEntries.length} mesures insérées`);
};
