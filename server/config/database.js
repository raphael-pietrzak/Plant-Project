const knex = require('knex');
const path = require('path');
const fs = require('fs');

// Définir le chemin vers le répertoire de la base de données
const dbDirectory = path.join(__dirname, '..', 'database');
const dbPath = path.join(dbDirectory, 'db.sqlite');

// Créer le répertoire de la base de données s'il n'existe pas
if (!fs.existsSync(dbDirectory)) {
  fs.mkdirSync(dbDirectory, { recursive: true });
  console.log(`Répertoire créé: ${dbDirectory}`);
}

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: dbPath
  },
  useNullAsDefault: true,
  pool: {
    afterCreate: (conn, done) => {
      // Activer les contraintes de clés étrangères
      conn.run('PRAGMA foreign_keys = ON', done);
    }
  }
});

module.exports = db;
