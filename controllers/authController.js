const promisify = require("es6-promisify");
const passport = require("passport");
const crypto = require("crypto");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const { send: sendEmail } = require("../handlers/mail");

exports.login = passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: "Failed to login",
  successRedirect: "/",
  successFlash: "You are logged in"
});

exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "You have been logged out");
  res.redirect("/");
};

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  req.flash("error", "You must be logged in");
  res.redirect("/login");
};

exports.forgot = async (req, res) => {
  // ensure if user exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash("info", "A password reset has been mailed");
    return res.redirect("/login");
  }

  // set reset token and expiry
  user.resetPasswordToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordExpires = Date.now() + 1000 * 60 * 60;
  await user.save();

  // send an email with the token
  const resetUrl = `https://${req.headers.host}/account/reset/${user.resetPasswordToken}`;

  await sendEmail({
    user,
    resetUrl: resetURL,
    subject: "Password reset",
    filename: "password-reset"
  });

  req.flash("info", `A password reset has been mailed`);

  // redirect to login after resetting
  res.redirect("/login");
};

exports.reset = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  });

  if (!user) {
    req.flash("error", "Password reset token is invalid or expired");
    return res.redirect("/login");
  }

  res.render("reset", { title: "Reset password" });
};

exports.confirmedPasswords = (req, res, next) => {
  if (req.body.password === req.body["password-confirm"]) {
    return next();
  }

  req.flash("error", "Password do not match");
  res.redirect("back");
};

exports.update = async (req, res) => {
  // to middleware!
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  });

  if (!user) {
    req.flash("error", "Password reset token is invalid or expired");
    return res.redirect("/login");
  }

  const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password);

  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  const updatedUser = await user.save();
  await req.login(updatedUser);
  req.flash("Password reset");
  res.redirect("/");
};
