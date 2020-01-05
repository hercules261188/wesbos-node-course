const express = require("express");
const router = express.Router();
const controllers = require("../controllers/storeController");
const { catchErrors } = require("../handlers/errorHandlers");

router.get("/", catchErrors(controllers.getStores));
router.get("/stores", catchErrors(controllers.getStores));

router.get("/add", controllers.addStore);
router.post("/add", catchErrors(controllers.createStore));

module.exports = router;
