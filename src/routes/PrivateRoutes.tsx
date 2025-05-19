import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { HomePage } from "../pages/home/HomePage";
import { EventsPage } from "../pages/home/EventsPage";
import { AcademicCentersPage } from "../pages/home/AcademicCentersPage";
import { VocationalTestPage } from "../pages/home/VocationalTestPage";
import { SimulationTestPage } from "../pages/home/SimulationTestPage";
import { NotFound } from "../pages/NotFound";
import { HeaderBar } from "../components/organisms/HeaderBar/HeaderBar";

function PrivateWrapper() {
  const { user } = useUser();
  if (!user) return <Navigate to="/login" replace />;
  return (
    <>
      <HeaderBar />
      <Outlet />
    </>
  );
}

export default function PrivateRoutes() {
  return (
    <Routes>
      <Route element={<PrivateWrapper />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/academic-centers" element={<AcademicCentersPage />} />
        <Route path="/vocational-test" element={<VocationalTestPage />} />
        <Route path="/simulation-test" element={<SimulationTestPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}