//FullscreenViewer.jsx
import { Button, Container, Row, Col } from "react-bootstrap";

const FullscreenViewer = ({ camera, onStartRecording, onStopRecording }) => {
  return (
    <Container className="my-4">
      <h4>{camera.name}</h4>
      <Row>
        <Col md={12}>
          {camera.status === "Active" ? (
            <img
              src={`http://localhost:3002/api/stream/${camera.cameraId}`}
              alt="Live Feed"
              style={{
                width: "100%",
                maxHeight: "500px",
                objectFit: "contain",
              }}
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
              }}
            >
              Camera is inactive
            </div>
          )}
        </Col>
      </Row>
      <div className="mt-3 d-flex gap-3">
        <Button variant="success" onClick={() => onStartRecording(camera._id)}>
          ▶️ Start Recording
        </Button>
        <Button variant="danger" onClick={() => onStopRecording(camera._id)}>
          ⏹ Stop Recording
        </Button>
      </div>
    </Container>
  );
};

export default FullscreenViewer;
