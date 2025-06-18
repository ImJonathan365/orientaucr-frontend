import { Outlet } from "react-router-dom";

export default function SimpleLayout() {
  return (
    <main style={{ minHeight: "100vh" }}>
      <Outlet />
    </main>
  );
}