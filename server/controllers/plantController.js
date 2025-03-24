const Plant = require('../models/plant');

exports.getAllPlants = async (req, res) => {
  try {
    const plants = await Plant.findAll({
      order: ['name', 'ASC']
    });
    
    res.json(plants);
  } catch (error) {
    console.error('Erreur lors de la récupération des plantes:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des plantes' });
  }
};

exports.getPlantById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const plant = await Plant.findOne({ id: parseInt(id) });
    
    if (!plant) {
      return res.status(404).json({ error: 'Plante non trouvée' });
    }
    
    res.json(plant);
  } catch (error) {
    console.error(`Erreur lors de la récupération de la plante ${req.params.id}:`, error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la plante' });
  }
};

exports.createPlant = async (req, res) => {
  try {
    const { name, species, device_id, image_url, location } = req.body;
    
    if (!name || !species) {
      return res.status(400).json({ error: 'Le nom et l\'espèce de la plante sont requis' });
    }
    
    const plant = await Plant.create({
      name,
      species,
      device_id,
      image_url,
      location,
      created_at: new Date()
    });
    
    res.status(201).json({
      message: 'Plante créée avec succès',
      plant
    });
  } catch (error) {
    console.error('Erreur lors de la création de la plante:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la plante' });
  }
};

exports.updatePlant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, species, device_id, image_url, location } = req.body;
    
    const plant = await Plant.findOne({ id: parseInt(id) });
    
    if (!plant) {
      return res.status(404).json({ error: 'Plante non trouvée' });
    }
    
    await Plant.update({ id: parseInt(id) }, {
      name: name || plant.name,
      species: species || plant.species,
      device_id: device_id || plant.device_id,
      image_url: image_url || plant.image_url,
      location: location || plant.location,
      updated_at: new Date()
    });
    
    const updatedPlant = await Plant.findOne({ id: parseInt(id) });
    
    res.json({
      message: 'Plante mise à jour avec succès',
      plant: updatedPlant
    });
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de la plante ${req.params.id}:`, error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la plante' });
  }
};

exports.deletePlant = async (req, res) => {
  try {
    const { id } = req.params;
    
    const plant = await Plant.findOne({ id: parseInt(id) });
    
    if (!plant) {
      return res.status(404).json({ error: 'Plante non trouvée' });
    }
    
    await Plant.delete({ id: parseInt(id) });
    
    res.json({
      message: 'Plante supprimée avec succès',
      plantId: id
    });
  } catch (error) {
    console.error(`Erreur lors de la suppression de la plante ${req.params.id}:`, error);
    res.status(500).json({ error: 'Erreur lors de la suppression de la plante' });
  }
};
