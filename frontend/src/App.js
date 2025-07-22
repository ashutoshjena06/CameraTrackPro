// App.js
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import CameraDetails from "./pages/CameraDetails";
import CameraList from "./pages/CameraList";
import Recordings from "./pages/Recordings";
import Header from "./components/Header";

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <>
      {!isLoginPage && <Header />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cameras" element={<CameraList />} />
        <Route path="/camera/:id" element={<CameraDetails />} />
        <Route path="/recordings" element={<Recordings />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
