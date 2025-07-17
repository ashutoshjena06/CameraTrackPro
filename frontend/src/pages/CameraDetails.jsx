import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Container, Card, Spinner } from "react-bootstrap";
import API from "../services/api";

const CameraDetails = () => {
  const { id } = useParams();
  const [camera, setCamera] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCamera = async () => {
    try {
      const res = await API.get(`/cameras/${id}`);
      setCamera(res.data);
    } catch (err) {
      console.error("Failed to load camera details", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecording = async (action) => {
    try {
      await API.post(`/stream/record/${action}/${id}`);
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
          <img
            src={
              camera.status === "Active"
                ? `http://localhost:3002/api/stream/${camera._id}`
                : "/offline-placeholder.jpg"
            }
            alt={camera.name}
            className="img-fluid"
            style={{ maxHeight: "500px", objectFit: "contain" }}
          />
          <p className="mt-3 text-muted">{camera.location}</p>
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
