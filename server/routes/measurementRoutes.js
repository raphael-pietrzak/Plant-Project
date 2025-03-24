const express = require('express');
const router = express.Router();
const measurementController = require('../controllers/measurementController');

// Routes pour les mesures
router.post('/', measurementController.createMeasurement);
router.get('/', measurementController.getMeasurements);
router.get('/devices', measurementController.getDevices);

module.exports = router;
