import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { Login } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import PublicHomePage from "../pages/PublicHomePage";
import { HomePage } from "../pages/home/HomePage";
import { CareerListPage } from "../pages/career/CareerListPage";
import { EditCareerPage } from "../pages/career/EditCareerPage";
import { NotFound } from "../pages/NotFound";
import { EventsPage } from "../pages/home/EventsPage";
import { AcademicCentersPage } from "../pages/home/AcademicCentersPage";
import { VocationalTestPage } from "../pages/home/VocationalTestPage";
import { SimulationTestPage } from "../pages/home/SimulationTestPage";
import UserProfilesPages from "../pages/UserProfilePage";
import { TestPage } from "../pages/test/TestPage";
import { TestListPage } from "../pages/test/TestListPage";
import { TestEditPage } from "../pages/test/TestEditPage";
import { TestAddPage } from "../pages/test/TestAddPage";
import { NewCareerPage } from "../pages/career/NewCareerPage";
import { UserEditPage } from "../pages/user/UserEditPage";
import UserListPage from "../pages/user/UserListPage";
/*import { RolesPage } from "../pages/roles/RolesPage";
import { RolesListPage } from "../pages/roles/RolesListPage";
import { RolesEditPage } from "../pages/roles/RolesEditPage";
import { RolesAddPage } from "../pages/roles/RolesAddPage";*/
import { RequireAuth } from "../pages/auth/RequireAuth";
import { EventsListPage } from "../pages/events/EventListPage";
import { EventsEditPage } from "../pages/events/EventEditPage";
import { EventAddPage } from "../pages/events/EventAddPage";


export default function AppRoutes() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<PublicHomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rutas privadas */}
      <Route path="/home" element={<RequireAuth><HomePage /></RequireAuth>} />
      <Route path="/events" element={<RequireAuth><EventsPage /></RequireAuth>} />
      <Route path="/academic-centers" element={<RequireAuth><AcademicCentersPage /></RequireAuth>} />
      <Route path="/vocational-test" element={<RequireAuth><VocationalTestPage /></RequireAuth>} />
      <Route path="/simulation-test" element={<RequireAuth><SimulationTestPage /></RequireAuth>} />
      <Route path="/career-list" element={<RequireAuth><CareerListPage /></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><UserProfilesPages /></RequireAuth>} />
      <Route path="/test" element={<RequireAuth><TestPage /></RequireAuth>} />
      <Route path="/test-list" element={<RequireAuth><TestListPage /></RequireAuth>} />
      <Route path="/test-list/edit/:id" element={<RequireAuth><TestEditPage /></RequireAuth>} />
      <Route path="/test-list/add" element={<RequireAuth><TestAddPage /></RequireAuth>} />
      <Route path="/careers/new" element={<RequireAuth><NewCareerPage /></RequireAuth>} />
      <Route path="/careers/edit/:id" element={<RequireAuth><EditCareerPage /></RequireAuth>} />
      <Route path="/usuarios/edit/:id" element={<RequireAuth><UserEditPage /></RequireAuth>} />
      <Route path="/usuarios" element={<RequireAuth><UserListPage /></RequireAuth>} />
      {/*}
      <Route path="/roles" element={<RequireAuth><RolesPage /></RequireAuth>} />
      <Route path="/roles-list" element={<RequireAuth><RolesListPage /></RequireAuth>} />
      <Route path="/roles-list/edit/:id" element={<RequireAuth><RolesEditPage /></RequireAuth>} />
      <Route path="/roles-list/add" element={<RequireAuth><RolesAddPage /></RequireAuth>}
      {*/}
      <Route path="/events" element={<RequireAuth><EventsPage /></RequireAuth>} />
      <Route path="/events-list" element={<RequireAuth><EventsListPage /></RequireAuth>} />
      <Route path="/events-list/edit/:id" element={<RequireAuth><EventsEditPage /></RequireAuth>} />
      <Route path="/events-list/add" element={<RequireAuth><EventAddPage /></RequireAuth>} />
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}