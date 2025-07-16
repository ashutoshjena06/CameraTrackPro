const Camera = require("../models/Camera");
const {
  startRecording,
  stopRecording,
  getRecordingCameras,
} = require("../utils/ffmpegUtils");

// Live stream redirection (for MJPEG/HTTP preview)
const getStream = async (req, res) => {
  try {
    const { cameraId } = req.params;
    const camera = await Camera.findById(cameraId);

    if (!camera || camera.status !== "Active") {
      return res.status(404).json({ message: "Camera not found or inactive" });
    }

    // Redirect to stream URL (e.g., MJPEG HTTP stream)
    return res.redirect(camera.streamUrl);
  } catch (err) {
    console.error("Stream error:", err.message);
    res.status(500).json({ message: "Unable to load stream" });
  }
};

// Start recording a camera stream
const startCameraRecording = async (req, res) => {
  try {
    const { cameraId } = req.params;
    const camera = await Camera.findById(cameraId);

    if (!camera || camera.status !== "Active") {
      return res.status(404).json({ message: "Camera not found or inactive" });
    }

    startRecording(cameraId, camera.streamUrl);
    res.json({ message: `Recording started for camera ${cameraId}` });
  } catch (err) {
    console.error("Start recording error:", err.message);
    res.status(500).json({ message: "Failed to start recording" });
  }
};

// Stop recording a camera stream
const stopCameraRecording = async (req, res) => {
  try {
    const { cameraId } = req.params;

    stopRecording(cameraId);
    res.json({ message: `Recording stopped for camera ${cameraId}` });
  } catch (err) {
    console.error("Stop recording error:", err.message);
    res.status(500).json({ message: "Failed to stop recording" });
  }
};

// List all cameras that are currently recording
const listActiveRecordings = (req, res) => {
  try {
    const activeCameras = getRecordingCameras();
    res.json({ activeCameras });
  } catch (err) {
    res.status(500).json({ message: "Error listing recordings" });
  }
};

module.exports = {
  getStream,
  startCameraRecording,
  stopCameraRecording,
  listActiveRecordings,
};
