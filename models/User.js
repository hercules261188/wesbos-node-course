const mongoose = require("mongoose");
const Schema = mongoose.schema;
mongoose.Promise = global.Promise;

const md5 = require("md5");
const validator = require("validator");
const mongodbErrorHandler = require("mongoose-mongodb-errors");
const passportLocalMongoose = require("password-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: 'Supply an email address',
    validator: [
      validator.isEmail,
      'Provide proper email address.'
    ]
  }
  name: {
    type: String,
    required: 'Supply a name',
    trim: true
  }
});

userSchema.plugin(passportLocalMongoose, {usernameField: 'email'})
userSchema.plugin(mongodbErrorHandler)

module.exports = mongoose.model("User", userSchema);
