import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "../pages/home/HomePage";
import { TestPage } from "../pages/test/TestPage";
import { User } from "../services/authService";

// Simulación de verificación de login
const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

export default function PrivateRoutes({ user }: { user: User }) {
  return isAuthenticated() ? (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/vocational-test/test" element={<TestPage />} />
    </Routes>
  ) : (
    <Navigate to="/login" />
  );
}
