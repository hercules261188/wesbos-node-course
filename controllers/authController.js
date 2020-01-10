const passport = require("passport");

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
