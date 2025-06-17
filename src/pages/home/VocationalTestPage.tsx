import SideBar from "../../components/organisms/SideBar/SideBar";
import { HeaderBar } from "../../components/organisms/HeaderBar/HeaderBar";
import FooterBar from "../../components/organisms/FooterBar/FooterBar";
import { Link } from "react-router-dom";
import { Icon } from "../../components/atoms/Icon/Icon";
import { useState, useEffect } from "react";
import { User } from "../../types/userType";
import { getCurrentUser } from "../../services/userService";

export const VocationalTestPage = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);


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
          <h1 className="text-center">Test Vocacional</h1>
          <p className="text-center">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur necessitatibus dolorem cupiditate omnis. Sunt incidunt ullam fugit beatae asperiores consectetur praesentium veritatis possimus temporibus, amet repudiandae, nemo cupiditate alias minus.</p>
          <center>
            <Link
              style={{ backgroundColor: "#4bc0e1", color: "#fff", border: "none" }}
              className="btn btn-success" to={currentUser ? "/test" : "/register"}>
              <Icon variant="play" size="xl" />
              Comenzar Test
            </Link>
          </center>
        </main>
      </div>
      <FooterBar />
    </>
  );
}