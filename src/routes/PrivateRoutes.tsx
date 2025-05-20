import { Routes, Route } from "react-router-dom";
import { HomePage } from "../pages/home/HomePage";
import { EventsPage } from "../pages/home/EventsPage";
import { AcademicCentersPage } from "../pages/home/AcademicCentersPage";
import { VocationalTestPage } from "../pages/home/VocationalTestPage";
import { SimulationTestPage } from "../pages/home/SimulationTestPage";
import { CareerListPage } from "../pages/CareerListPage";
import { UserProfile } from '../pages/user/UserProfile';
import { NewCareerPage } from "../pages/NewCareerPage";
import { EditCareerPage } from "../pages/EditCareerPage";
import UserListPage from '../pages/user/UserListPage';
import { TestPage } from "../pages/test/TestPage";
import { TestListPage } from "../pages/test/TestListPage";
import { TestEditPage } from "../pages/test/TestEditPage";
import { TestAddPage } from "../pages/test/TestAddPage";
import { UserEditPage } from "../pages/user/UserEditPage";

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
      <Route path="/test" element={<TestPage />} />
      <Route path="/test-list" element={<TestListPage />} />
      <Route path="/test-list/edit/:id" element={<TestEditPage />} />
      <Route path="/test-list/add" element={<TestAddPage />} />
      <Route path="/careers/new" element={<NewCareerPage />} />
      <Route path="/careers/edit/:id" element={<EditCareerPage />} />
      <Route path="/usuarios/edit/:id" element={<UserEditPage />} />
      <Route path="/usuarios" element={<UserListPage />} />
    </Routes>
  );
}