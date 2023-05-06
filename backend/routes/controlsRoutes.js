const express = require("express");
const {
  accessControls,
} = require("../controllers/controlsControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/access").get(protect, accessControls);

module.exports = router;
