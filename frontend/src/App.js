// App.js
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import CameraDetails from "./pages/CameraDetails";
import CameraList from "./pages/CameraList";
import Header from "./components/Header";

function AppWrapper() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";
  console.log("isLoginPage", isLoginPage);
  return (
    <>
      {!isLoginPage & <Header />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="cameras" element={<CameraList />} />
        <Route path="/camera/:id" element={<CameraDetails />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
