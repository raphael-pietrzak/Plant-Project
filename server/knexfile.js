const path = require('path');
const fs = require('fs');

// Définir les chemins
const dbDirectory = path.join(__dirname, 'database');
const migrationsDirectory = path.join(__dirname, 'migrations');
const seedsDirectory = path.join(__dirname, 'seeds');

// Créer les répertoires s'ils n'existent pas
[dbDirectory, migrationsDirectory, seedsDirectory].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Répertoire créé: ${dir}`);
  }
});

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.join(dbDirectory, 'db.sqlite')
    },
    migrations: {
      directory: migrationsDirectory
    },
    seeds: {
      directory: seedsDirectory
    },
    useNullAsDefault: true,
    pool: {
      afterCreate: (conn, done) => {
        conn.run('PRAGMA foreign_keys = ON', done);
      }
    }
  }
};
