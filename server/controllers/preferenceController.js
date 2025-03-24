const Preference = require('../models/preference');

exports.getAllPreferences = async (req, res) => {
  try {
    const preferences = await Preference.findAll();
    
    // Convertir en format clé-valeur pour faciliter l'utilisation
    const preferencesMap = {};
    preferences.forEach(pref => {
      preferencesMap[pref.key] = pref.value;
    });
    
    res.json(preferencesMap);
  } catch (error) {
    console.error('Erreur lors de la récupération des préférences:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des préférences' });
  }
};

exports.getPreferenceByKey = async (req, res) => {
  try {
    const { key } = req.params;
    
    const preference = await Preference.findOne({ key });
    
    if (!preference) {
      return res.status(404).json({ error: 'Préférence non trouvée' });
    }
    
    res.json({ key: preference.key, value: preference.value });
  } catch (error) {
    console.error(`Erreur lors de la récupération de la préférence ${req.params.key}:`, error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la préférence' });
  }
};

exports.createOrUpdatePreference = async (req, res) => {
  try {
    const { key, value } = req.body;
    
    if (!key || value === undefined) {
      return res.status(400).json({ error: 'La clé et la valeur sont requises' });
    }
    
    const [preference, created] = await Preference.findOrCreate({
      where: { key },
      defaults: { value }
    });
    
    if (!created) {
      await Preference.update({ key }, { value });
    }
    
    res.status(created ? 201 : 200).json({
      message: created ? 'Préférence créée avec succès' : 'Préférence mise à jour avec succès',
      preference: { key, value }
    });
  } catch (error) {
    console.error('Erreur lors de la création/mise à jour de la préférence:', error);
    res.status(500).json({ error: 'Erreur lors de la création/mise à jour de la préférence' });
  }
};

exports.updatePreference = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    
    if (value === undefined) {
      return res.status(400).json({ error: 'La valeur est requise' });
    }
    
    const preference = await Preference.findOne({ key });
    
    if (!preference) {
      return res.status(404).json({ error: 'Préférence non trouvée' });
    }
    
    await Preference.update({ key }, { value });
    
    res.json({
      message: 'Préférence mise à jour avec succès',
      preference: { key, value }
    });
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de la préférence ${req.params.key}:`, error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la préférence' });
  }
};
