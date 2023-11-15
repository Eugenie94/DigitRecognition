const mongoose = require("mongoose");

const thingSchema = mongoose.Schema({
  image: { type: String, required: false },
  description: { type: String, required: false },
});

module.exports = mongoose.model("Images", thingSchema);
