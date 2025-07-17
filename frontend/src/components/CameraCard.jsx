import { Card, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CameraCard = ({ cam, onToggleCamera }) => {
  const navigate = useNavigate();

  return (
    <Card className="shadow mb-4">
      <Card.Img
        variant="top"
        src={
          cam.status === "Active"
            ? `http://localhost:3002/api/stream/${cam.cameraId}`
            : "/offline-placeholder.jpg"
        }
        alt={cam.name}
        style={{ height: "200px", objectFit: "cover" }}
      />
      <Card.Body>
        <Card.Title>{cam.name}</Card.Title>
        <Card.Text>{new Date(cam.createdAt).toLocaleString()}</Card.Text>
        <Badge
          bg={cam.status === "Active" ? "success" : "secondary"}
          className="mb-2"
        >
          {cam.status}
        </Badge>
        <div className="d-flex justify-content-between mt-3">
          <Button
            variant={cam.status === "Active" ? "danger" : "success"}
            onClick={() => onToggleCamera(cam._id, cam.status)}
          >
            {cam.status === "Active" ? "Stop" : "Start"} Camera
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate(`/camera/${cam._id}`)}
          >
            View Fullscreen
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CameraCard;
