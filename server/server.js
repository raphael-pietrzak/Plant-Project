const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Chemins des fichiers JSON
const plantsPath = path.join(__dirname, 'data', 'plants.json');
const preferencesPath = path.join(__dirname, 'data', 'preferences.json');

// Fonction utilitaire pour lire les fichiers JSON
async function readJsonFile(filePath) {
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
}

// Fonction utilitaire pour écrire dans les fichiers JSON
async function writeJsonFile(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Routes pour les plantes
app.get('/api/plants', async (req, res) => {
  try {
    const data = await readJsonFile(plantsPath);
    res.json(data.plants);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la lecture des plantes' });
  }
});

app.post('/api/plants', async (req, res) => {
  try {
    const data = await readJsonFile(plantsPath);
    const newPlant = {
      id: data.plants.length + 1,
      ...req.body
    };
    data.plants.push(newPlant);
    await writeJsonFile(plantsPath, data);
    res.status(201).json(newPlant);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout de la plante' });
  }
});

// Routes pour les préférences
app.get('/api/preferences', async (req, res) => {
  try {
    const data = await readJsonFile(preferencesPath);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la lecture des préférences' });
  }
});

app.put('/api/preferences', async (req, res) => {
  try {
    await writeJsonFile(preferencesPath, req.body);
    res.json(req.body);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour des préférences' });
  }
});

// Route pour mettre à jour les données des plantes (simulation IoT)
app.put('/api/plants/:id/sensors', async (req, res) => {
  try {
    const data = await readJsonFile(plantsPath);
    const plant = data.plants.find(p => p.id === parseInt(req.params.id));
    if (!plant) {
      return res.status(404).json({ error: 'Plante non trouvée' });
    }
    
    Object.assign(plant, req.body);
    await writeJsonFile(plantsPath, data);
    res.json(plant);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour des données capteurs' });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
