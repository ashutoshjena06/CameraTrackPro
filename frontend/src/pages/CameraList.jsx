import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import API from "../services/api";
import CameraCard from "../components/CameraCard";

const CameraList = () => {
  const [cameras, setCameras] = useState([]);

  const fetchCameras = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/cameras", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCameras(res.data);
    } catch (err) {
      console.error("Error loading cameras", err);
    }
  };

  const handleToggleCamera = async (id, currentStatus) => {
    try {
      const endpoint =
        currentStatus === "Active"
          ? `/cameras/stop/${id}`
          : `/cameras/start/${id}`;

      await API.post(endpoint);
      fetchCameras(); // Refresh
    } catch (err) {
      console.error("Failed to toggle camera", err);
    }
  };

  useEffect(() => {
    fetchCameras();
  }, []);

  return (
    <Container className="mt-4">
      <h3 className="mb-4">📷 All Cameras</h3>
      <Row>
        {cameras.map((cam) => (
          <Col md={4} key={cam._id}>
            <CameraCard cam={cam} onToggleCamera={handleToggleCamera} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CameraList;
