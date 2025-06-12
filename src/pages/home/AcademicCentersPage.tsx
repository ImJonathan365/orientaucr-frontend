import SideBar from "../../components/organisms/SideBar/SideBar";
import { HeaderBar } from "../../components/organisms/HeaderBar/HeaderBar";
import FooterBar from "../../components/organisms/FooterBar/FooterBar";
import { useState } from "react";

export const AcademicCentersPage = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  return (
    <>
      <HeaderBar />
      <div style={{ display: "flex", minHeight: "80vh" }}>
        <SideBar visible={sidebarVisible} setVisible={setSidebarVisible} />
        <main
          style={{
            flex: 1,
            padding: "1rem",
            marginLeft: sidebarVisible ? 280 : 0,
            transition: "margin-left 0.3s"
          }}>
          <center><h1>Centros académicos</h1></center>
        </main>
      </div>
      <FooterBar />
    </>
  );
}