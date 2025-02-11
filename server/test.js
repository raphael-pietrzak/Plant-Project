const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();

// Configuration de multer pour le téléchargement
const upload = multer({ 
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

// Route de réception d'image
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Aucun fichier reçu');
    }
    
    res.status(200).send('Image uploadée avec succès');
});

app.listen(3000, () => {
    console.log('Serveur en écoute sur le port 3000');
});