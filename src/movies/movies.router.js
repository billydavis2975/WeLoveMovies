const router = require("express").Router({ mergeParams: true });
const controller = require("./movies.controller");
const cors = require("cors");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/").get(controller.list).all(methodNotAllowed);
router.route("/:movieId").get(controller.read).all(methodNotAllowed);
router
  .route("/:movieId/theaters")
  .get(cors(), controller.whichTheater)
  .all(methodNotAllowed);
router
  .route("/:movieId/reviews")
  .get(cors(), controller.movieReviews)
  .all(methodNotAllowed);

module.exports = router;
