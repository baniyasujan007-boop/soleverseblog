import { Outlet } from "react-router-dom";

import TopBar from "../layouts/TopBar/TopBar";
import Navbar from "../Navbar/Navbar";
import Footer from "../layouts/Footer/Footer";

function MainLayout() {
  return (
    <>
      <TopBar />
      <Navbar />

      <Outlet />

      <Footer />
    </>
  );
}

export default MainLayout;