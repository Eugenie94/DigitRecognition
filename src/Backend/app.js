const express = require("express");
const mongoose = require("mongoose");
const Thing = require("./models/Images");

mongoose
  .connect(
    "mongodb+srv://angulardyma:4yl7GJ3AC58uEGtt@clustertra.6j5zr5s.mongodb.net/test?retryWrites=true&w=majority"
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

app.post("/api/images", (req, res, next) => {
  delete req.body._id;
  const image = new Thing({
    ...req.body,
  });
  image
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
});

app.get("/api/images", (req, res, next) => {
  Thing.find()
    .then((images) => res.status(200).json(images))
    .catch((error) => res.status(400).json({ error }));
});

module.exports = app;
