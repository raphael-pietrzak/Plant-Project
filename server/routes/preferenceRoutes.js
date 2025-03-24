const express = require('express');
const router = express.Router();
const preferenceController = require('../controllers/preferenceController');

// Routes pour les préférences
router.get('/', preferenceController.getAllPreferences);
router.get('/:key', preferenceController.getPreferenceByKey);
router.post('/', preferenceController.createOrUpdatePreference);
router.put('/:key', preferenceController.updatePreference);

module.exports = router;
