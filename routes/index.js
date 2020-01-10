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
router.get("/store/:slug", catchErrors(controllers.getStoreBySlug));

router.get("/tags", catchErrors(controllers.getStoresByTag));
router.get("/tags/:tag", catchErrors(controllers.getStoresByTag));

module.exports = router;
