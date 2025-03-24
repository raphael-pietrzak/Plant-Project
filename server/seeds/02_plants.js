exports.seed = async function(knex) {
  // Données des plantes directement au format de la base de données
  const plantEntries = [
    {
      id: 1,
      name: "Monstera Deliciosa",
      species: "Tropical",
      location: 'Intérieur',
      waterFrequency: 7,
      lastWatered: new Date(),
      image_url: "https://media.istockphoto.com/id/469538141/fr/photo/jeune-plant.jpg?s=612x612&w=0&k=20&c=YusPoy6PHk7ai5y4iMzgx_RpVJjcmvyVelmfUBkUSKk=",
      device_id: 'ESP8266_1'
    },
    {
      id: 2,
      name: "Ficus Lyrata",
      species: "Arbres d'intérieur",
      location: 'Intérieur',
      waterFrequency: 7,
      lastWatered: new Date(),
      image_url: "https://media.istockphoto.com/id/469538141/fr/photo/jeune-plant.jpg?s=612x612&w=0&k=20&c=YusPoy6PHk7ai5y4iMzgx_RpVJjcmvyVelmfUBkUSKk=",
      device_id: 'ESP8266_1'
    }
  ];

  // Vider la table des plantes
  await knex('plants').del();
  
  // Insérer les données des plantes
  if (plantEntries.length > 0) {
    await knex('plants').insert(plantEntries);
    console.log(`${plantEntries.length} plantes insérées`);
  }
};
