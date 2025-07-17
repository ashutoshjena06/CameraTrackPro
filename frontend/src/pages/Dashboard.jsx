import { useEffect, useState } from "react";
import { Card, Button, Container, Row, Col, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Dashboard = () => {
  const [cameras, setCameras] = useState([]);
  const navigate = useNavigate();

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
    navigate(`/camera/${cameraId}`);
  };

  return (
    <Container className="mt-4">
      <h3 className="mb-4">📺 Live Camera Feeds</h3>
      <Row>
        {cameras.map((cam) => (
          <Col md={4} key={cam._id} className="mb-4">
            <Card className="shadow">
              <Card.Img
                variant="top"
                src={
                  cam.status === "Active"
                    ? `http://localhost:8092/cam1`
                    : "/offline-placeholder.jpg"
                }
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
              <Card.Body>
                <Card.Title>{cam.name}</Card.Title>
                <Card.Text>{cam.location}</Card.Text>
                <Badge
                  bg={cam.status === "Active" ? "success" : "secondary"}
                  className="mb-2"
                >
                  {cam.status}
                </Badge>
                <div className="d-grid gap-2 mt-2">
                  <Button
                    variant="primary"
                    onClick={() => handleView(cam.cameraId)}
                    disabled={cam.status !== "Active"}
                  >
                    View Fullscreen
                  </Button>
                  <Button
                    variant={cam.status === "Active" ? "danger" : "success"}
                    onClick={() =>
                      handleToggleCamera(cam.cameraId, cam.status === "Active")
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
