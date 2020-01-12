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
  },
  photo: String,
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: "Supply an author"
  }
});

// define indices
storeSchema.index({ name: "text", description: "text" });
// Mongodb cyclic dependency issue
// storeSchema.index({ location: "2dsphere" });

// autogenerate slug before saving
// next(); is like middleware
storeSchema.pre("save", async function(next) {
  if (!this.isModified("name")) return next();
  this.slug = slug(this.name);

  // search for any stores with the same slug of "slug-1":
  const slugRegex = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, "i");
  const storesWithSlug = await this.constructor.find({ slug: slugRegex });
  if (storesWithSlug.length) {
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
  }

  next();
});

storeSchema.statics.getTagsList = function() {
  return this.aggregate([
    { $unwind: `$tags` },
    { $group: { _id: "$tags", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
};

module.exports = mongoose.model("Store", storeSchema);
