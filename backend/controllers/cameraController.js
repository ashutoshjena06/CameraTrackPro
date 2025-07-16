const Camera = require("../models/Camera");

// Add Camera
const addCamera = async (req, res) => {
  try {
    const { name, location, streamUrl, status } = req.body;
    const camera = await Camera.create({ name, location, streamUrl, status });
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

module.exports = {
  addCamera,
  updateCamera,
  deleteCamera,
  getAllCameras,
  getCameraById,
};
