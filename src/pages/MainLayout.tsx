import SideBar from "../components/organisms/SideBar/SideBar";
import { HeaderBar } from "../components/organisms/HeaderBar/HeaderBar";
import FooterBar from "../components/organisms/FooterBar/FooterBar";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export const MainLayout = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const { user, loading } = useUser();

  if (loading && !user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div>Cargando...</div>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <HeaderBar />
        <div style={{ display: "flex", flex: 1 }}>
          {user && <SideBar visible={sidebarVisible} setVisible={setSidebarVisible} />}
          <main style={{ flex: 1, transition: "margin-left 0.3s" }}>
            <Outlet />
          </main>
        </div>
        <FooterBar />
      </div>
    </>
  );
};