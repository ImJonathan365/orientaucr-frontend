import { Routes, Route } from "react-router-dom";
import { Login } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { NotFound } from "../pages/NotFound";
import PublicHomePage from "../pages/PublicHomePage";

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicHomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}