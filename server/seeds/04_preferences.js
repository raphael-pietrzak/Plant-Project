const path = require('path');
const fs = require('fs');



exports.seed = async function(knex) {
  await knex('preferences').del();
  
  // Créer les entrées de préférences au format clé-valeur
  const preferencesEntries = [
    {
      key: 'notifications.enabled',
      value: JSON.stringify(true)
    },
    {
      key: 'notifications.humidity',
      value: JSON.stringify(false)
    },
    {
      key: 'notifications.temperature',
      value: JSON.stringify(true)
    },
    {
      key: 'display.darkMode',
      value: JSON.stringify(false)
    },
    {
      key: 'system.measurementUnit',
      value: JSON.stringify('metric')
    },
    {
      key: 'system.language',
      value: JSON.stringify('fr')
    },
    {
      key: 'thresholds.temperature.ideal',
      value: JSON.stringify(22)
    },
    {
      key: 'thresholds.humidity.min',
      value: JSON.stringify(40)
    },
    {
      key: 'thresholds.sunlight.min',
      value: JSON.stringify(300)
    }
  ];
  
  // Insérer les données des préférences
  await knex('preferences').insert(preferencesEntries);
  console.log('Préférences utilisateur insérées');
};
