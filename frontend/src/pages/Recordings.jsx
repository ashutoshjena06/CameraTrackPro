import { useEffect, useState } from "react";
import { Container, Card, Row, Col, Spinner } from "react-bootstrap";
import API from "../services/api";

const Recordings = () => {
  const [cameras, setCameras] = useState([]);
  const [recordings, setRecordings] = useState({}); // { cameraId: [videos] }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await API.get("/cameras");
        setCameras(res.data);
        // Fetch recordings for each camera
        const recs = {};
        await Promise.all(
          res.data.map(async (cam) => {
            console.log("cam", cam);
            try {
              const recRes = await API.get(`/recordings/${cam.cameraId}`);
              recs[cam.cameraId] = recRes.data;
            } catch {
              recs[cam.cameraId] = [];
            }
          })
        );
        setRecordings(recs);
      } catch (err) {
        console.error("Failed to load cameras or recordings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p className="mt-2">Loading recordings...</p>
      </Container>
    );

  return (
    <Container className="mt-4">
      <h3 className="mb-4">📼 All Camera Recordings</h3>
      {cameras.map((cam) => (
        <div key={cam.cameraId} className="mb-5">
          <h5 className="mb-3">Camera: {cam.cameraId} ({cam.name})</h5>
          <Row>
            {(recordings[cam.cameraId] || []).length === 0 ? (
              <Col className="text-muted mb-4">No recordings found.</Col>
            ) : (
              recordings[cam.cameraId].map((video, idx) => (
                <Col md={4} key={idx} className="mb-4">
                  <Card className="shadow">
                  <video
  src={`http://localhost:3002${video.url}`}
  controls
  className="w-100"
/>
                    <Card.Body>
                      <Card.Text>
                        Date: {new Date(video.timestamp).toLocaleString()}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </div>
      ))}
    </Container>
  );
};

export default Recordings; 