const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const router = express.Router();
const User = require('../Server/Model');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à la base de données MongoDB
mongoose.connect('mongodb+srv://chamahoubadi:Chama23@cluster0.sbmwgyp.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.once('open', () => {
  console.log('Connexté à la base de donnéesavec succès');
});

// Routes de l'API - À définir selon vos besoins



// Exemple de route pour créer un utilisateur
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
}
});

module.exports = router;





// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
