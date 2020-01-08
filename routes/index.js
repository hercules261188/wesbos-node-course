const express = require("express");
const router = express.Router();
const controllers = require("../controllers/storeController");
const { catchErrors } = require("../handlers/errorHandlers");

router.get("/", catchErrors(controllers.getStores));
router.get("/stores", catchErrors(controllers.getStores));
router.get("/add", controllers.addStore);

router.post(
  "/add",
  controllers.upload,
  catchErrors(controllers.resize),
  catchErrors(controllers.createStore)
);

router.post(
  "/add/:id",
  controllers.upload,
  catchErrors(controllers.resize),
  catchErrors(controllers.updateStore)
);

router.get("/stores/:id/edit", catchErrors(controllers.editStore));

module.exports = router;
