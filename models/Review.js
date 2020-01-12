const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const reviewSchema = new mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: "Supply an author"
  },
  store: {
    type: mongoose.Schema.ObjectId,
    ref: "Store",
    required: "Supply a store"
  },
  text: {
    type: String,
    required: "Review must contain a text"
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  }
});

module.exports = mongoose.model("Review", reviewSchema);
