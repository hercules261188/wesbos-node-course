const express = require("express");
const router = express.Router();
const controllers = require("../controllers/storeController");

router.get("/", controllers.homePage);

module.exports = router;
