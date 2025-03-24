const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const db = require('./config/database');

// Routes
const measurementRoutes = require('./routes/measurementRoutes');
const plantRoutes = require('./routes/plantRoutes');
const preferenceRoutes = require('./routes/preferenceRoutes');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/measurements', measurementRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api/preferences', preferenceRoutes);

// Initialisation de la base de données et démarrage du serveur
async function initializeServer() {
  try {
    // Vérifier que le répertoire des migrations existe
    const migrationsDir = path.join(__dirname, 'migrations');
    if (!fs.existsSync(migrationsDir)) {
      fs.mkdirSync(migrationsDir, { recursive: true });
      console.log(`Répertoire des migrations créé: ${migrationsDir}`);
    }

    // Vérifier la connexion à la base de données
    await db.raw('SELECT 1+1 as result');
    console.log('Base de données SQLite connectée');
    
    try {
      // Exécuter les migrations
      await db.migrate.latest();
      console.log('Migrations exécutées avec succès');
      // Exécuter les seeds
      await db.seed.run();
      console.log('Seeds exécutés avec succès');
    } catch (migrationError) {
      console.warn('Erreur lors de l\'exécution des migrations:', migrationError.message);
      console.warn('L\'application continuera sans exécuter les migrations.');
    }
    
    // Démarrer le serveur
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erreur lors de l\'initialisation du serveur:', error);
    process.exit(1);
  }
}

// Démarrer le serveur
initializeServer();