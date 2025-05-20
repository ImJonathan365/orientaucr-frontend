import { Routes, Route } from "react-router-dom";
import { HomePage } from "../pages/home/HomePage";
import { EventsPage } from "../pages/home/EventsPage";
import { AcademicCentersPage } from "../pages/home/AcademicCentersPage";
import { VocationalTestPage } from "../pages/home/VocationalTestPage";
import { SimulationTestPage } from "../pages/home/SimulationTestPage";
import { CareerListPage } from "../pages/CareerListPage";
import { UserProfile } from '../pages/user/UserProfile';
import UserListPage from '../pages/user/UserListPage';

export default function PrivateRoutes() {
  return (
    <Routes>
      <Route path="/home" element={<HomePage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/academic-centers" element={<AcademicCentersPage />} />
      <Route path="/vocational-test" element={<VocationalTestPage />} />
      <Route path="/simulation-test" element={<SimulationTestPage />} />
      <Route path="/career-list" element={<CareerListPage />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/usuarios" element={<UserListPage />} />
    </Routes>
  );
}