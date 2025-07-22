//Dashboard.jsx
import { useEffect, useState } from "react";
import { Card, Button, Container, Row, Col, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

// ⏱️ Add this helper to format time

const Dashboard = () => {
  const [cameras, setCameras] = useState([]);
  const navigate = useNavigate();
  const getTime = () => {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1; // Months are 0-based
    const year = now.getFullYear();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const [currentTime, setCurrentTime] = useState(getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchCameras = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/cameras", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCameras(res.data);
    } catch (err) {
      console.error("Failed to load cameras", err);
    }
  };

  useEffect(() => {
    fetchCameras();
  }, []);

  const handleToggleCamera = async (cameraId, isActive) => {
    const route = isActive
      ? `/cameras/stop/${cameraId}`
      : `/cameras/start/${cameraId}`;
    try {
      const token = localStorage.getItem("token");
      await API.post(
        route,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchCameras(); // Refresh list
    } catch (err) {
      console.error("Camera toggle failed", err);
    }
  };

  const handleView = (cameraId) => {
    console.log("cameraId", cameraId);
    navigate(`/camera/${cameraId}`);
  };

  return (
    <Container className="mt-4">
      <h3 className="mb-4">📺 Live Camera Feeds</h3>
      <Row>
        {cameras.map((cam) => (
          <Col md={4} key={cam._id} className="mb-4">
            <Card className="shadow">
              {cam.status === "Active" ? (
                <Card.Img
                  variant="top"
                  src={`http://localhost:3002/api/stream/${cam.cameraId}`}
                  style={{
                    height: "220px",
                    objectFit: "cover",
                    borderTopLeftRadius: "0.5rem",
                    borderTopRightRadius: "0.5rem",
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/offline-placeholder.jpg";
                  }}
                />
              ) : (
                <div
                  style={{
                    height: "220px",
                    background: "#222",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderTopLeftRadius: "0.5rem",
                    borderTopRightRadius: "0.5rem",
                  }}
                >
                  Camera is inactive
                </div>
              )}
              <Card.Body>
                <Card.Title>{cam.name}</Card.Title>
                <Card.Text>{cam.location}</Card.Text>
                <Card.Text
                  className="text-muted"
                  style={{ fontSize: "0.9rem" }}
                >
                  ⏱️ {currentTime}
                </Card.Text>
                <Badge
                  bg={cam.status === "Active" ? "success" : "secondary"}
                  className="mb-2"
                >
                  {cam.status}
                </Badge>
                <div className="d-grid gap-2 mt-2">
                  <Button
                    variant="primary"
                    onClick={() => handleView(cam._id)}
                    disabled={cam.status !== "Active"}
                  >
                    View Fullscreen
                  </Button>
                  <Button
                    variant={cam.status === "Active" ? "danger" : "success"}
                    onClick={() =>
                      handleToggleCamera(cam._id, cam.status === "Active")
                    }
                  >
                    {cam.status === "Active" ? "Stop Camera" : "Start Camera"}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Dashboard;
