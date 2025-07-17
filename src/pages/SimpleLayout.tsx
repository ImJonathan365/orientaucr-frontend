import { Outlet } from "react-router-dom";

export const SimpleLayout = () => {
  return (
    <>
      <main style={{ minHeight: "100vh" }}>
        <Outlet />
      </main>
    </>
  );
};

export default SimpleLayout;