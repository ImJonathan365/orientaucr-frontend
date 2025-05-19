import SideBar from "../../components/organisms/SideBar/SideBar";
import { HeaderBar } from "../../components/organisms/HeaderBar/HeaderBar";
import FooterBar from "../../components/organisms/FooterBar/FooterBar";

export function HomePage () {
  return (
    <>
      <HeaderBar />
      <div style={{ display: "flex", minHeight: "80vh" }}>
        <SideBar />
        <main style={{ flex: 1, padding: "1rem" }}>
          <center><h1>Bienvenido</h1></center>
        </main>
      </div>
      <FooterBar />
    </>
  );
}