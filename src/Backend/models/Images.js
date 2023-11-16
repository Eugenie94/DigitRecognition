const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const thingSchema = new Schema({
  pixels: {
    type: [Number],
    required: true,
  },
  prediction: {
    type: Number,
    required: false,
  },
});

module.exports = mongoose.model("Images", thingSchema);
