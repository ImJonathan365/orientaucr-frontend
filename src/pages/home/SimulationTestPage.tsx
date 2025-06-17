import SideBar from "../../components/organisms/SideBar/SideBar";
import { HeaderBar } from "../../components/organisms/HeaderBar/HeaderBar";
import FooterBar from "../../components/organisms/FooterBar/FooterBar";
import { Link } from "react-router-dom";
import { Icon } from "../../components/atoms/Icon/Icon";
import { User } from "../../types/userType";
import { useState, useEffect } from "react";
import { getCurrentUser } from "../../services/userService";

export const SimulationTestPage = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch {
        setCurrentUser(null);
      }
    };
    fetchUser();
  }, []);

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
              className="btn btn-success" to={currentUser ? "/simulation-exam-start" : "/register"}>
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