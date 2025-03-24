const path = require('path');
const fs = require('fs');
const knexConfig = require('./knexfile');
const knex = require('knex')(knexConfig.development);

async function initializeDatabase() {
  try {
    console.log('Vérification des répertoires...');
    // Vérifier que le répertoire de la base de données existe
    const dbDirectory = path.join(__dirname, 'database');
    if (!fs.existsSync(dbDirectory)) {
      fs.mkdirSync(dbDirectory, { recursive: true });
      console.log(`Répertoire de base de données créé: ${dbDirectory}`);
    }

    // Vérifier que le répertoire des migrations existe
    const migrationsDir = path.join(__dirname, 'migrations');
    if (!fs.existsSync(migrationsDir)) {
      fs.mkdirSync(migrationsDir, { recursive: true });
      console.log(`Répertoire des migrations créé: ${migrationsDir}`);
    }

    // Vérifier que le répertoire des seeds existe
    const seedsDir = path.join(__dirname, 'seeds');
    if (!fs.existsSync(seedsDir)) {
      fs.mkdirSync(seedsDir, { recursive: true });
      console.log(`Répertoire des seeds créé: ${seedsDir}`);
    }

    // Vérifier la connexion
    console.log('Tentative de connexion à la base de données...');
    const result = await knex.raw('SELECT 1+1 as result');
    console.log('Connexion réussie!', result);

    // Exécuter les migrations
    console.log('Exécution des migrations...');
    await knex.migrate.latest();
    console.log('Migrations exécutées avec succès');

    // Exécuter les seeds
    console.log('Exécution des seeds...');
    await knex.seed.run();
    console.log('Seeds exécutés avec succès');

    console.log('Base de données initialisée avec succès!');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
  } finally {
    // Fermer la connexion
    await knex.destroy();
  }
}

// Exécuter le script
initializeDatabase();
