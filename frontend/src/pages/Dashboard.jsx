// pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { Card, Button, Container, Row, Col, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Dashboard = () => {
  const [cameras, setCameras] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
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
    fetchCameras();
  }, []);

  const handleView = (id) => {
    navigate(`/camera/${id}`);
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
                    ? `http://localhost:6000/api/stream/${cam._id}`
                    : "/offline-placeholder.jpg"
                }
                alt={cam.name}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>{cam.name}</Card.Title>
                <Card.Text>{cam.location}</Card.Text>
                <Badge
                  bg={cam.status === "Active" ? "success" : "danger"}
                  className="mb-2"
                >
                  {cam.status === "Active" ? "Online" : "Offline"}
                </Badge>
                <div className="d-grid">
                  <Button variant="primary" onClick={() => handleView(cam._id)}>
                    View Fullscreen
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
