import SideBar from "../../components/organisms/SideBar/SideBar";
import { HeaderBar } from "../../components/organisms/HeaderBar/HeaderBar";
import FooterBar from "../../components/organisms/FooterBar/FooterBar";
import { useUser } from "../../contexts/UserContext";
import { Link } from "react-router-dom";
import { Icon } from "../../components/atoms/Icon/Icon";

export const VocationalTestPage = () => {
  const { user } = useUser();

  return (
    <>
      <HeaderBar />
      <div style={{ display: "flex", minHeight: "80vh" }}>
        <SideBar />
        <main style={{ flex: 1, padding: "1rem" }}>
          <h1 className="text-center">Test Vocacional</h1>
          <p className="text-center">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur necessitatibus dolorem cupiditate omnis. Sunt incidunt ullam fugit beatae asperiores consectetur praesentium veritatis possimus temporibus, amet repudiandae, nemo cupiditate alias minus.</p>
          <center>
            <Link 
            style={{ backgroundColor: "#4bc0e1", color: "#fff", border: "none" }}
            className="btn btn-success" to={user ? "/test" : "/register"}>
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