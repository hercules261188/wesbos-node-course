const express = require("express");
const router = express.Router();
const controllers = require("../controllers/storeController");
const { catchErrors } = require("../handlers/errorHandlers");

router.get("/", controllers.homePage);

router.get("/add", controllers.addStore);
router.post("/add", catchErrors(controllers.createStore));

module.exports = router;
