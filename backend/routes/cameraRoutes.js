const express = require("express");
const {
  addCamera,
  updateCamera,
  deleteCamera,
  getAllCameras,
  getCameraById,
  startCamera,
  stopCamera,
  startRecording,
  stopRecording,
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

// 🔁 New Actions
router.post("/start/:id", startCamera);
router.post("/stop/:id", stopCamera);
router.post("/record/start/:id", startRecording);
router.post("/record/stop/:id", stopRecording);

module.exports = router;
