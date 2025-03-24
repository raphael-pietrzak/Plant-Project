const Device = require('../models/device');
const Measurement = require('../models/measurement');

exports.createMeasurement = async (req, res) => {
  try {
    const { temperature, humidity, light, device_id } = req.body;
    
    // Log des données reçues
    console.log('Nouvelles mesures reçues:');
    console.log('Device ID:', device_id);
    console.log('Température:', temperature, '°C');
    console.log('Humidité:', humidity, '%');
    console.log('Luminosité:', light, 'lux');
    console.log('Timestamp:', new Date().toISOString());
    console.log('------------------------');

    // Vérifier si le device existe, sinon le créer
    const [device] = await Device.findOrCreate({
      where: { device_id },
      defaults: {
        name: `Device ${device_id}`,
        location: 'Unknown'
      }
    });

    // Mettre à jour la date de dernière connexion
    await Device.update({ device_id }, { last_seen: new Date() });

    // Enregistrer les mesures
    const measurement = await Measurement.create({
      device_id,
      temperature,
      humidity,
      timestamp: new Date()
    });

    res.status(201).json({
      message: 'Mesures reçues et enregistrées avec succès',
      measurement_id: measurement.id,
      timestamp: measurement.timestamp
    });
  } catch (error) {
    console.error('Erreur lors du traitement des mesures:', error);
    res.status(500).json({ error: 'Erreur lors du traitement des mesures' });
  }
};

exports.getMeasurements = async (req, res) => {
  try {
    const { device_id, limit = 100 } = req.query;
    
    const options = {
      order: ['timestamp', 'DESC'],
      limit: parseInt(limit)
    };
    
    if (device_id) {
      options.where = { device_id };
    }
    
    const measurements = await Measurement.findAll(options);
    
    res.json(measurements);
  } catch (error) {
    console.error('Erreur lors de la récupération des mesures:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des mesures' });
  }
};

exports.getDevices = async (req, res) => {
  try {
    const devices = await Device.findAll({
      order: ['last_seen', 'DESC']
    });
    
    res.json(devices);
  } catch (error) {
    console.error('Erreur lors de la récupération des appareils:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des appareils' });
  }
};
