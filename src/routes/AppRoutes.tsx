import { Routes, Route } from "react-router-dom";
import MainLayout from "../pages/MainLayout";
import SimpleLayout from "../pages/SimpleLayout";
import LoginPage from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import PublicHomePage from "../pages/PublicHomePage";
import { HomePage } from "../pages/home/HomePage";
import { CareerListPage } from "../pages/career/CareerListPage";
import { EditCareerPage } from "../pages/career/EditCareerPage";
import { NotFound } from "../pages/NotFound";
import { EventsPage } from "../pages/home/EventsPage";
import { AcademicCentersPage } from "../pages/home/AcademicCentersPage";
import { VocationalTestPage } from "../pages/home/VocationalTestPage";
import { SimulationTestPage } from "../pages/home/SimulationTestPage";
import { UserProfile } from "../pages/user/UserProfile";
import { TestPage } from "../pages/test/TestPage";
import { TestListPage } from "../pages/test/TestListPage";
import { TestEditPage } from "../pages/test/TestEditPage";
import { TestAddPage } from "../pages/test/TestAddPage";
import { NewCareerPage } from "../pages/career/NewCareerPage";
import { UserEditPage } from "../pages/user/UserEditPage";
import { UserCreatePage } from "../pages/user/UserCreatePage";
import UserListPage from "../pages/user/UserListPage";
import { UserProfileEdit } from "../pages/user/UserProfileEdit";
import { RolesListPage } from "../pages/roles/RolesListPage";
import { RolesEditPage } from "../pages/roles/RolesEditPage";
import { RolesAddPage } from "../pages/roles/RolesAddPage";
import { RequireAuth } from "../pages/auth/RequireAuth";
import { EventsListPage } from "../pages/events/EventListPage";
import { EventsEditPage } from "../pages/events/EventEditPage";
import { EventAddPage } from "../pages/events/EventAddPage";
import { SimulationQuestionListPage } from "../pages/SimulationQuestion/SimulationQuestionListPage";
import { SimulationQuestionAddPage } from "../pages/SimulationQuestion/SimulationQuestionAddPage";
import { SimulationQuestionEditPage } from "../pages/SimulationQuestion/SimulationQuestionEditPage";
import { SimulationExamPage } from "../pages/SimulationQuestion/SimulationExamPage";
import { SimulationExamStartPage } from "../pages/SimulationQuestion/SimulationExamStartPage";
import { CourseListPage } from "../pages/career/CourseListPage";
import { NotificationListPage } from "../pages/notification/NotificationListPage";
import { NotificationAddPage } from "../pages/notification/NotificationAddPage";
import { NotificationEditPage } from "../pages/notification/NotificationEditPage";
import { AllCourseListPage } from "../pages/course/AllCourseListPage";
import { NewCoursesPage } from "../pages/course/NewCoursePage";
import { EditCoursePage } from "../pages/course/EditCoursePage";
import { CategoryListPage } from "../pages/category/CategoryListPage";
import { CategoryAddPage } from "../pages/category/CategoryAddPage";
import { CategoryEditPage } from "../pages/category/CategoryEditPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<PublicHomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Rutas privadas con el Header y el Sidebar*/}
      <Route element={<MainLayout />}>
        <Route path="/home" element={<RequireAuth><HomePage /></RequireAuth>} />
        <Route path="/events" element={<RequireAuth><EventsPage /></RequireAuth>} />
        <Route path="/academic-centers" element={<RequireAuth><AcademicCentersPage /></RequireAuth>} />
        <Route path="/vocational-test" element={<RequireAuth><VocationalTestPage /></RequireAuth>} />
        <Route path="/simulation-test" element={<RequireAuth><SimulationTestPage /></RequireAuth>} />
        <Route path="/career-list" element={<RequireAuth><CareerListPage /></RequireAuth>} />
        <Route path="/test" element={<RequireAuth><TestPage /></RequireAuth>} />
        <Route path="/test-list" element={<RequireAuth><TestListPage /></RequireAuth>} />
        <Route path="/test-list/edit/:id" element={<RequireAuth><TestEditPage /></RequireAuth>} />
        <Route path="/test-list/add" element={<RequireAuth><TestAddPage /></RequireAuth>} />
        <Route path="/careers/new" element={<RequireAuth><NewCareerPage /></RequireAuth>} />
        <Route path="/careers/edit/:id" element={<RequireAuth><EditCareerPage /></RequireAuth>} />
        <Route path="/careers/curricula/:id" element={<RequireAuth><CourseListPage /></RequireAuth>} />
        <Route path="/users/edit/:id" element={<RequireAuth><UserEditPage /></RequireAuth>} />
        <Route path="/users" element={<RequireAuth><UserListPage /></RequireAuth>} />
        <Route path="/users/add" element={<RequireAuth><UserCreatePage /></RequireAuth>} />
        <Route path="/roles-list" element={<RequireAuth><RolesListPage /></RequireAuth>} />
        <Route path="/roles-list/edit/:id" element={<RequireAuth><RolesEditPage /></RequireAuth>} />
        <Route path="/roles-list/add" element={<RequireAuth><RolesAddPage /></RequireAuth>} />
        <Route path="/events" element={<RequireAuth><EventsPage /></RequireAuth>} />
        <Route path="/events-list" element={<RequireAuth><EventsListPage /></RequireAuth>} />
        <Route path="/events-list/edit/:id" element={<RequireAuth><EventsEditPage /></RequireAuth>} />
        <Route path="/events-list/add" element={<RequireAuth><EventAddPage /></RequireAuth>} />
        <Route path="/simulation-questions" element={<RequireAuth><SimulationQuestionListPage /></RequireAuth>} />
        <Route path="/simulation-questions/add" element={<RequireAuth><SimulationQuestionAddPage /></RequireAuth>} />
        <Route path="/simulation-questions/edit/:id" element={<RequireAuth><SimulationQuestionEditPage /></RequireAuth>} />
        <Route path="/simulation-exam" element={<RequireAuth><SimulationExamPage /></RequireAuth>} />
        <Route path="/simulation-exam-start" element={<RequireAuth><SimulationExamStartPage /></RequireAuth>} />
        <Route path="/notifications" element={<RequireAuth><NotificationListPage /></RequireAuth>} />
        <Route path="/notifications/add" element={<RequireAuth><NotificationAddPage /></RequireAuth>} />
        <Route path="/notifications/edit/:id" element={<RequireAuth><NotificationEditPage /></RequireAuth>} />
        <Route path="/course-list" element={<RequireAuth><AllCourseListPage /></RequireAuth>} />
        <Route path="/courses/new" element={<RequireAuth><NewCoursesPage /></RequireAuth>} />
        <Route path="/courses/edit/:id" element={<RequireAuth><EditCoursePage /></RequireAuth>} />
        <Route path="/categories" element={<RequireAuth><CategoryListPage /></RequireAuth>} />
        <Route path="/categories/add" element={<RequireAuth><CategoryAddPage /></RequireAuth>} />
        <Route path="/categories/edit/:id" element={<RequireAuth><CategoryEditPage /></RequireAuth>} />
      </Route>

      {/* Rutas privadas sin Header ni Sidebar */}
      <Route element={<SimpleLayout />}>
        <Route path="/profile" element={<RequireAuth><UserProfile /></RequireAuth>} />
        <Route path="/profile/edit" element={<RequireAuth><UserProfileEdit /></RequireAuth>} />
      </Route>

      {/* Ruta de inicio por defecto */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}