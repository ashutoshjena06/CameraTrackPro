//CameraCard.jsx
import { useEffect } from "react";
import { useState } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CameraCard = ({ cam, onToggleCamera }) => {
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
  });
  return (
    <Card className="shadow mb-4">
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
        <Card.Text className="text-muted" style={{ fontSize: "0.9rem" }}>
          ⏱️ {currentTime}
        </Card.Text>
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
