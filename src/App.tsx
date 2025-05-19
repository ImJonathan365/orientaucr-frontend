import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "./contexts/UserContext";
import { HomePage } from "./pages/home/HomePage";
import { Login } from "./pages/auth/LoginPage";
import { EventsPage } from "./pages/home/EventsPage";
import { AcademicCentersPage } from "./pages/home/AcademicCentersPage";
import { VocationalTestPage } from "./pages/home/VocationalTestPage";
import { SimulationTestPage } from "./pages/home/SimulationTestPage";

function AppRoutes() {
  const { user } = useUser();

  if (!user) {
    return (
      <Login />
    );
  }

  return (
    <>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/academic-centers" element={<AcademicCentersPage />} />
        <Route path="/vocational-test" element={<VocationalTestPage />} />
        <Route path="/simulation-test" element={<SimulationTestPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;