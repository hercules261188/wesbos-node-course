const express = require("express");
const router = express.Router();

// Do work here
router.get("/", (req, res) => {
  res.render("hello", {
    name: "Alex",
    dog: "Ceasar"
  });
});

router.get("/reverse/:name", (req, res) => {
  res.send(
    req.params.name
      .split("")
      .reverse()
      .join("")
  );
});

module.exports = router;
