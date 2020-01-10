const mongoose = require("mongoose");
const Store = mongoose.model("Store");

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
  const store = await new Store(req.body).save();
  req.flash("success", `Successfully created ${store.name}`);
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  const stores = await Store.find();
  res.render("stores", { title: "Stores", stores });
};

exports.editStore = async (req, res) => {
  const store = await Store.findOne({ _id: req.params.id });
  // TODO: authorize
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
  const store = await Store.findOne({ slug: req.params.slug });
  if (!store) return next();
  res.render("store", { title: store.name, store });
};

exports.getStoresByTag = async (req, res) => {
  const tags = await Store.getTagsList();
  const activeTag = req.params.tag;
  res.render("tags", { title: "Tags", tags, activeTag });
};
