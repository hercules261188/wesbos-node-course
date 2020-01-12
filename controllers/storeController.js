const mongoose = require("mongoose");
const Store = mongoose.model("Store");
const User = mongoose.model("User");

const jimp = require("jimp");
const uuid = require("uuid");

const multer = require("multer");
const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith("image/");
    if (isPhoto) return next(null, true);
    return next({ message: `Filetype is not allowed` }, false);
  }
};

exports.homePage = (req, res) => {
  res.render("index");
};

exports.addStore = (req, res) => {
  res.render("editStore", { title: "Add Store" });
};

exports.upload = multer(multerOptions).single("photo");

exports.resize = async (req, res, next) => {
  if (!req.file) return next();

  const extension = req.file.mimetype.split("/")[1];
  req.body.photo = `${uuid.v4()}.${extension}`;

  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);

  next();
};

exports.createStore = async (req, res) => {
  req.body.author = req.user._id;
  const store = await new Store(req.body).save();

  req.flash("success", `Successfully created ${store.name}`);
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  const page = req.params.page || 1;
  const limit = 4;
  const skip = (page - 1) * limit;

  const stores = await Store.find()
    .skip(skip)
    .limit(limit);

  res.render("stores", { title: "Stores", stores });
};

const confirmOwner = (store, user) => {
  if (!store.author.equals(user._id)) {
    throw new Error("You must own this store in order to edit it");
  }
};

exports.editStore = async (req, res) => {
  const store = await Store.findOne({ _id: req.params.id });
  confirmOwner(store, req.user);
  res.render("editStore", { title: `Edit ${store.name}`, store });
};

exports.updateStore = async (req, res) => {
  req.body.location.type = "Point";

  const query = { _id: req.params.id };
  const data = req.body;
  const options = {
    new: true, // return new store instead of old one
    runValidators: true // by default mongo doesnt run validation on update
  };

  const store = await Store.findOneAndUpdate(query, data, options).exec();
  req.flash("success", `Successfully updated ${store.name}`);
  res.redirect(`/stores/${store._id}/edit`);
};

exports.getStoreBySlug = async (req, res, next) => {
  const store = await Store.findOne({ slug: req.params.slug }).populate(
    "author reviews"
  );

  if (!store) return next();
  res.render("store", { title: store.name, store });
};

exports.getStoresByTag = async (req, res) => {
  const activeTag = req.params.tag;
  const tagQuery = activeTag || { $exists: true };

  const tagsPromise = Store.getTagsList();
  const storesPromise = Store.find({ tags: tagQuery });

  const [tags, stores] = await Promise.all([tagsPromise, storesPromise]);
  res.render("tags", { title: "Tags", tags, stores, activeTag });
};

exports.searchStores = async (req, res) => {
  const stores = await Store.find(
    { $text: { $search: req.query.q } },
    { score: { $meta: "textScore" } } // field projection
  )
    .sort({
      score: { $meta: "textScore" }
    })
    .limit(5);

  res.json(stores);
};

exports.mapStores = async (req, res) => {
  const coordinates = [req.query.lng, req.query.lat].map(parseFloat);
  const query = {
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates
        },
        $maxDistance: 10000
      }
    }
  };

  const stores = await Store.find(query)
    .select("slug name description location")
    .limit(10);

  res.json(stores);
};

exports.mapPage = (req, res) => {
  res.render("map", { title: "Map" });
};

exports.heartStore = async (req, res) => {
  // toString — lifehack to get id:
  const hearts = req.user.hearts.map(obj => obj.toString());

  // not "$push" to avoid duplications:
  const operator = hearts.includes(req.params.id) ? "$pull" : "$addToSet";

  const query = req.user._id;
  const options = { new: true };
  const data = {
    [operator]: {
      hearts: req.params.id
    }
  };

  const user = await User.findByIdAndUpdate(query, data, options);
  res.json(user);
};

exports.getHearts = async (req, res) => {
  const stores = await Store.find({
    _id: { $in: req.user.hearts }
  });

  res.render("stores", { title: "Liked Stores", stores });
};

exports.getTopStores = async (req, res) => {
  const stores = await Store.getTopStores();
  res.render("topStores", { title: "Top Stores", stores });
};
