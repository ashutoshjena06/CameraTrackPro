// pages/CameraRecordings.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Row, Col, Spinner } from "react-bootstrap";
import API from "../services/api";

const CameraRecordings = () => {
  const { id } = useParams();
  const [videos, setVideos] = useState([]);
  const [cameraName, setCameraName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const cameraRes = await API.get(`/cameras/${id}`);
        setCameraName(cameraRes.data.name);

        const res = await API.get(`/recordings/${id}`); // Must exist on backend
        setVideos(res.data);
      } catch (err) {
        console.error("Failed to fetch recordings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecordings();
  }, [id]);

  if (loading)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p className="mt-2">Loading recordings...</p>
      </Container>
    );

  return (
    <Container className="mt-4">
      <h3 className="mb-4">🎥 Recordings for: {cameraName}</h3>
      <Row>
        {videos.map((video, index) => (
          <Col md={4} key={index} className="mb-4">
            <Card className="shadow">
              <video
                src={`http://localhost:3002/uploads/${video.filename}`}
                controls
                className="w-100"
              ></video>
              <Card.Body>
                <Card.Text>
                  Date: {new Date(video.timestamp).toLocaleString()}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CameraRecordings;
