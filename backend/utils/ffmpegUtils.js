const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const activeRecordings = new Map(); // cameraId → process

// Ensure the recordings folder exists
const recordingsDir = path.join(__dirname, "..", "recordings");
if (!fs.existsSync(recordingsDir)) {
  fs.mkdirSync(recordingsDir);
}

// Start recording from a stream URL
const startRecording = (cameraId, streamUrl) => {
  if (activeRecordings.has(cameraId)) {
    console.log(`Recording already in progress for camera ${cameraId}`);
    return;
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outputFile = path.join(recordingsDir, `${cameraId}_${timestamp}.mp4`);

  const ffmpeg = spawn("ffmpeg", [
    "-i",
    streamUrl,
    "-c",
    "copy", // Direct stream copy (efficient for MJPEG/RTSP/HLS)
    "-f",
    "mp4",
    outputFile,
  ]);

  ffmpeg.stderr.on("data", (data) => {
    console.log(`[FFmpeg] ${cameraId}: ${data}`);
  });

  ffmpeg.on("close", (code) => {
    console.log(
      `[FFmpeg] Recording stopped for camera ${cameraId} (code ${code})`
    );
    activeRecordings.delete(cameraId);
  });

  activeRecordings.set(cameraId, ffmpeg);
  console.log(`Started recording for camera ${cameraId}`);
};

// Stop the recording
const stopRecording = (cameraId) => {
  const process = activeRecordings.get(cameraId);
  if (process) {
    process.kill("SIGINT");
    console.log(`Stopping recording for camera ${cameraId}`);
  } else {
    console.log(`No active recording found for camera ${cameraId}`);
  }
};

// List all currently recording camera IDs
const getRecordingCameras = () => {
  return Array.from(activeRecordings.keys());
};

module.exports = {
  startRecording,
  stopRecording,
  getRecordingCameras,
};
