const express = require("express");
const {
  addCamera,
  updateCamera,
  deleteCamera,
  getAllCameras,
  getCameraById,
} = require("../controllers/cameraController");

const router = express.Router();

// Route to add a new camera
router.post("/", addCamera);

// Route to update a camera
router.put("/:id", updateCamera);

// Route to soft delete a camera
router.delete("/:id", deleteCamera);

// Route to get all cameras
router.get("/", getAllCameras);

// Route to get a single camera by ID
router.get("/:id", getCameraById);

module.exports = router;
