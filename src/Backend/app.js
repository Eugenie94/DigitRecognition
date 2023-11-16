const express = require("express");
const mongoose = require("mongoose");
const Thing = require("./models/Images");
const multer = require("multer");
const Jimp = require("jimp");
 
mongoose
  .connect(
    "mongodb+srv://admin:admin@cluster0.tjtyqkb.mongodb.net/"
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));
 
const app = express();
 
app.use(express.json());
 
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
 
// Utilisation de multer pour gérer le téléchargement des images
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });4

app.post("/api/Images", upload.single("image"), async (req, res, next) => {
  try {
    const pixels = await convertImageToPixels(req.file.buffer);
    const image = new Thing({ pixels });
    await image.save();

    res.status(201).json({ message: "Objet enregistré !" });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'image :", error);
    res.status(400).json({ error });
  }
});
 
app.get("/api/Images", (req, res, next) => {
  Thing.find()
    .then((images) => res.status(200).json(images))
    .catch((error) => res.status(400).json({ error }));
});
 
async function convertImageToPixels(imageBuffer) {
  const image = await Jimp.read(imageBuffer);
  const width = image.getWidth();
  const height = image.getHeight();
  const pixels = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const color = Jimp.intToRGBA(image.getPixelColor(x, y));
      pixels.push(color);
    }
  }

  return pixels;
}

module.exports = app;