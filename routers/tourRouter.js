const express = require("express");
const router = express.Router();
const requireAuth = require ("../middleware/requireAuth")
const {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
} = require("../controllers/tourControllers");

router.use(requireAuth);
router.get("/", getAllTours);
router.post("/", createTour);
router.get("/:tourId", getTourById);
router.put("/:tourId", updateTour);
router.delete("/:tourId", deleteTour);

module.exports = router;
