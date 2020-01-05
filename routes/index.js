const express = require("express");
const router = express.Router();
const controllers = require("../controllers/storeController");

router.get("/", controllers.homePage);

router.get("/add", controllers.addStore);
router.post("/add", controllers.createStore);

module.exports = router;
