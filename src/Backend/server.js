require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const Drawing = require('./models/Images');
const app = express();
app.use(express.json());
app.use(cors());
 
 
app.use('/predict', express.static(path.join(__dirname, '..', 'FrontEnd','model')));
 
/*Connexion du server à la base de données*/
mongoose.connect(process.env.MONGO_URI, {
dbName: 'DigitRecognition',
useNewUrlParser: true,
useUnifiedTopology: true,
})
.then(() => {
  console.log('Connecté à la base de données');
    /* Écoute du port*/
    app.listen(process.env.PORT, () => {
      console.log('Écoute des requêtes sur le port', process.env.PORT);
    });
  })
  .catch((err) => {
    console.error(err);
  });
 
/*Les routes pour la communication  avec le model de l'IA*/
app.get('/predict', async (req, res) => {
  const filePath = path.join(__dirname, '..', 'FrontEnd','model' ,'model.json');
  console.log(filePath);
 
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Erreur lors de la lecture du fichier JSON :', err);
      res.status(500).json({ error: 'Erreur lors de la lecture du fichier JSON' });
    } else {
      console.log('Lecture du fichier JSON terminée');
      const jsonData = JSON.parse(data);
      res.status(200).json(jsonData);
    }
  });
});
 
/*Les routes pour sauvegarde  des images*/
app.post('/save', async (req, res) => {
  try {
    const { pixels, prediction } = req.body;
 
    /* Création du dessin*/
    const newDrawing = await Drawing.create({ pixels, prediction });
 
    console.log('Dessin créé avec succès');
    res.json({ message: 'Dessin créé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la création du dessin :', error);
    res.status(500).json({ error: 'Erreur lors de la création du dessin' });
  }
});