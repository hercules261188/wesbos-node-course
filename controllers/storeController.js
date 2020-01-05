const mongoose = require("mongoose");
const Store = mongoose.model("Store");

exports.homePage = (req, res) => {
  res.render("index");
};

exports.addStore = (req, res) => {
  res.render("editStore", { title: "Add Store" });
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
