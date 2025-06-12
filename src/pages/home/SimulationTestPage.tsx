import SideBar from "../../components/organisms/SideBar/SideBar";
import { HeaderBar } from "../../components/organisms/HeaderBar/HeaderBar";
import FooterBar from "../../components/organisms/FooterBar/FooterBar";
import { Link } from "react-router-dom";
import { Icon } from "../../components/atoms/Icon/Icon";
import { getUserFromLocalStorage } from "../../utils/Auth";
import { User } from "../../types/userType";
import { useState } from "react";

export const SimulationTestPage = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const user: User | null = getUserFromLocalStorage();

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
          <center>
            <h1>Prueba simulada</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex nesciunt maxime magni repellat deserunt voluptas itaque illo, aut sapiente similique, veritatis dolorum necessitatibus minima aspernatur officia dolorem quo possimus eveniet.</p>
            <Link
              style={{ backgroundColor: "#4bc0e1", color: "#fff", border: "none" }}
              className="btn btn-success" to={user ? "/simulation-exam-start" : "/register"}>
              <Icon variant="play" size="xl" />
              Comenzar Prueba Simulada
            </Link>
          </center>
        </main>
      </div>
      <FooterBar />
    </>
  );
}