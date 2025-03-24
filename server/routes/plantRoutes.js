const express = require('express');
const router = express.Router();
const plantController = require('../controllers/plantController');

// Routes pour les plantes
router.get('/', plantController.getAllPlants);
router.post('/', plantController.createPlant);
router.get('/:id', plantController.getPlantById);
router.put('/:id', plantController.updatePlant);
router.delete('/:id', plantController.deletePlant);

module.exports = router;
