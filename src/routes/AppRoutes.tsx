import { Routes, Route } from "react-router-dom";
import { MainLayout } from "../pages/MainLayout";
import { SimpleLayout } from "../pages/SimpleLayout";
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
      {/* Rutas de autenticación */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Rutas públicas con Header */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<PublicHomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/academic-centers" element={<AcademicCentersPage />} />
      </Route>

      {/* Rutas privadas con Header y Sidebar */}
      <Route element={<RequireAuth><MainLayout /></RequireAuth>}>
        <Route path="/vocational-test" element={<VocationalTestPage />} />
        <Route path="/simulation-test" element={<SimulationTestPage />} />
        <Route path="/career-list" element={<CareerListPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/test-list" element={<TestListPage />} />
        <Route path="/test-list/edit/:id" element={<TestEditPage />} />
        <Route path="/test-list/add" element={<TestAddPage />} />
        <Route path="/careers/new" element={<NewCareerPage />} />
        <Route path="/careers/edit/:id" element={<EditCareerPage />} />
        <Route path="/careers/curricula/:id" element={<CourseListPage />} />
        <Route path="/users/edit/:id" element={<UserEditPage />} />
        <Route path="/users" element={<UserListPage />} />
        <Route path="/users/add" element={<UserCreatePage />} />
        <Route path="/roles-list" element={<RolesListPage />} />
        <Route path="/roles-list/edit/:id" element={<RolesEditPage />} />
        <Route path="/roles-list/add" element={<RolesAddPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events-list" element={<EventsListPage />} />
        <Route path="/events-list/edit/:id" element={<EventsEditPage />} />
        <Route path="/events-list/add" element={<EventAddPage />} />
        <Route path="/simulation-questions" element={<SimulationQuestionListPage />} />
        <Route path="/simulation-questions/add" element={<SimulationQuestionAddPage />} />
        <Route path="/simulation-questions/edit/:id" element={<SimulationQuestionEditPage />} />
        <Route path="/simulation-exam" element={<SimulationExamPage />} />
        <Route path="/simulation-exam-start" element={<SimulationExamStartPage />} />
        <Route path="/notifications" element={<NotificationListPage />} />
        <Route path="/notifications/add" element={<NotificationAddPage />} />
        <Route path="/notifications/edit/:id" element={<NotificationEditPage />} />
        <Route path="/course-list" element={<AllCourseListPage />} />
        <Route path="/courses/new" element={<NewCoursesPage />} />
        <Route path="/courses/edit/:id" element={<EditCoursePage />} />
        <Route path="/categories" element={<CategoryListPage />} />
        <Route path="/categories/add" element={<CategoryAddPage />} />
        <Route path="/categories/edit/:id" element={<CategoryEditPage />} />
      </Route>

      {/* Rutas privadas sin Header ni Sidebar */}
      <Route element={<SimpleLayout />}>
        <Route path="/profile" element={<RequireAuth><UserProfile /></RequireAuth>} />
        <Route path="/profile/edit" element={<RequireAuth><UserProfileEdit /></RequireAuth>} />
      </Route>

      {/* Para rutas que no existen */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}