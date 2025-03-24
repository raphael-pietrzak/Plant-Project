const fs = require('fs').promises;

// Fonction utilitaire pour lire les fichiers JSON
async function readJsonFile(filePath) {
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
}

// Fonction utilitaire pour écrire dans les fichiers JSON
async function writeJsonFile(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

module.exports = {
  readJsonFile,
  writeJsonFile
};
