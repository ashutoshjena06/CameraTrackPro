const Camera = require("../models/Camera");

// Add Camera
const addCamera = async (req, res) => {
  try {
    const { cameraId, name, location, streamUrl, status } = req.body;
    const camera = await Camera.create({
      cameraId,
      name,
      location,
      streamUrl,
      status,
    });
    res.status(201).json(camera);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding camera", error: err.message });
  }
};

// Update Camera
const updateCamera = async (req, res) => {
  try {
    const camera = await Camera.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!camera) return res.status(404).json({ message: "Camera not found" });
    res.json(camera);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating camera", error: err.message });
  }
};

// Delete Camera (Soft Delete)
const deleteCamera = async (req, res) => {
  try {
    const camera = await Camera.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    if (!camera) return res.status(404).json({ message: "Camera not found" });
    res.json({ message: "Camera deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting camera", error: err.message });
  }
};

// List All Cameras (Filter out soft-deleted)
const getAllCameras = async (req, res) => {
  try {
    const cameras = await Camera.find({ isDeleted: false });
    res.json(cameras);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching cameras", error: err.message });
  }
};

// Get Single Camera
const getCameraById = async (req, res) => {
  try {
    const camera = await Camera.findById(req.params.id);
    if (!camera || camera.isDeleted)
      return res.status(404).json({ message: "Camera not found" });
    res.json(camera);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching camera", error: err.message });
  }
};

// ✅ Start Camera (sets status to Active)
const startCamera = async (req, res) => {
  try {
    const camera = await Camera.findByIdAndUpdate(
      req.params.id,
      { status: "Active" },
      { new: true }
    );
    if (!camera) return res.status(404).json({ message: "Camera not found" });
    res.json({ message: "Camera started", camera });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error starting camera", error: err.message });
  }
};

// ⏹️ Stop Camera (sets status to Inactive)
const stopCamera = async (req, res) => {
  try {
    const camera = await Camera.findByIdAndUpdate(
      req.params.id,
      { status: "Inactive" },
      { new: true }
    );
    if (!camera) return res.status(404).json({ message: "Camera not found" });
    res.json({ message: "Camera stopped", camera });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error stopping camera", error: err.message });
  }
};

// 🎥 Start Recording (you can later implement actual recording logic)
const startRecording = async (req, res) => {
  try {
    // This is just a mock — ideally you trigger FFmpeg or another tool here
    res.json({ message: `Recording started for camera ${req.params.id}` });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error starting recording", error: err.message });
  }
};

// ⏹️ Stop Recording (mock)
const stopRecording = async (req, res) => {
  try {
    res.json({ message: `Recording stopped for camera ${req.params.id}` });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error stopping recording", error: err.message });
  }
};

module.exports = {
  addCamera,
  updateCamera,
  deleteCamera,
  getAllCameras,
  getCameraById,
  startCamera,
  stopCamera,
  startRecording,
  stopRecording,
};
