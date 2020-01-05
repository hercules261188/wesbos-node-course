const slug = require("slugs");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: `Please enter the store name.`
  },
  slug: String,
  description: {
    type: String,
    trim: true
  },
  tags: [String],
  created: {
    type: Date,
    default: Date.now
  },
  location: {
    type: {
      type: String,
      default: "Point"
    },
    coordinates: [
      {
        type: Number,
        required: "Supply the coordinates."
      }
    ],
    address: {
      type: String,
      required: "Supply an address."
    }
  }
});

// autogenerate slug before saving
// next(); is like middleware
storeSchema.pre("save", function(next) {
  if (!this.isModified("name")) return next();

  this.slug = slug(this.name);
  next();
});

module.exports = mongoose.model("Store", storeSchema);
