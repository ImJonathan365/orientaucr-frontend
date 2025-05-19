import { Routes, Route } from "react-router-dom";
import { EventsPage } from "../pages/home/EventsPage";
import { AcademicCentersPage } from "../pages/home/AcademicCentersPage";
import { VocationalTestPage } from "../pages/home/VocationalTestPage";
import { SimulationTestPage } from "../pages/home/SimulationTestPage";
import { Login } from "../pages/auth/LoginPage";
import { Register } from "../pages/auth/RegisterPage";
import { NotFound } from "../pages/NotFound";

export default function PublicRoutes({ onLogin }: { onLogin: (user: any) => void }) {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/academic-centers" element={<AcademicCentersPage />} />
      <Route path="/vocational-test" element={<VocationalTestPage />} />
      <Route path="/simulation-test" element={<SimulationTestPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}