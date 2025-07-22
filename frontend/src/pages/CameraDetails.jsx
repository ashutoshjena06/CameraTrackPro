//CameraDetails.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Container, Card, Spinner } from "react-bootstrap";
import API from "../services/api";

const CameraDetails = () => {
  console.log("hii from CameraDetails");
  const { id } = useParams();
  const [camera, setCamera] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStart, setRecordingStart] = useState(null);
  const [recordingEnd, setRecordingEnd] = useState(null);
  const [timer, setTimer] = useState(0);

  const fetchCamera = async () => {
    try {
      console.log("fetchCamera id", id);
      const res = await API.get(`/cameras/${id}`);
      console.log("fetchCamera res", res.data);
      setCamera(res.data);
    } catch (err) {
      console.error("Failed to load camera details", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecording = async (action) => {
    console.log("handleRecording", action, " id ", id );
    try {
      await API.post(`/stream/${id}/${action}`);
      if (action === "start") {
        setIsRecording(true);
        const now = new Date();
        setRecordingStart(now);
        setRecordingEnd(null);
        setTimer(0);
      } else {
        setIsRecording(false);
        setRecordingEnd(new Date());
      }
      alert(
        `Recording ${action === "start" ? "started" : "stopped"} successfully`
      );
    } catch (err) {
      alert("Failed to toggle recording");
    }
  };

  const handleCameraToggle = async () => {
    try {
      const action = camera.status === "Active" ? "stop" : "start";
      await API.post(`/cameras/${action}/${id}`);
      fetchCamera(); // refresh camera status
    } catch (err) {
      alert("Failed to toggle camera");
    }
  };

  useEffect(() => {
    fetchCamera();
  }, []);

  useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else if (!isRecording && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p className="mt-3">Loading camera...</p>
      </Container>
    );
  }

  if (!camera) return <div className="text-center">Camera not found</div>;

  return (
    <Container className="mt-4">
      <Card className="text-center shadow-lg">
        <Card.Header className="bg-dark text-white">
          <h4>{camera.name}</h4>
        </Card.Header>
        <Card.Body>
          {camera.status === "Active" ? (
            <img
              src={`http://localhost:3002/api/stream/${camera.cameraId}`}
              alt={camera.name}
              className="img-fluid"
              style={{ maxHeight: "500px", objectFit: "contain" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "500px",
                background: "#222",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                borderRadius: "0.5rem",
              }}
            >
              Camera is inactive
            </div>
          )}
          <p className="mt-3 text-muted">{camera.location}</p>
          {isRecording && (
            <div style={{ fontWeight: "bold", color: "red", fontSize: "1.2rem" }}>
              Recording... {new Date(timer * 1000).toISOString().substr(14, 5)}
            </div>
          )}
          {recordingStart && recordingEnd && (
            <div className="text-muted mt-2">
              Recorded: {recordingStart.toLocaleTimeString()} - {recordingEnd.toLocaleTimeString()}
            </div>
          )}
          <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
            <Button
              variant="success"
              onClick={() => handleRecording("start")}
               disabled={camera.status !== "Active"}
            >
              ▶️ Start Recording
            </Button>
            <Button
              variant="danger"
              onClick={() => handleRecording("stop")}
              disabled={camera.status !== "Active"}
            >
              ⏹ Stop Recording
            </Button>
            <Button
              variant={camera.status === "Active" ? "warning" : "primary"}
              onClick={handleCameraToggle}
            >
              {camera.status === "Active"
                ? "🔴 Stop Camera"
                : "🟢 Start Camera"}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CameraDetails;
