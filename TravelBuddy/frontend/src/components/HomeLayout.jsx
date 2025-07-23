import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const HomeLayout = () => {
  return (
    <>
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

export default HomeLayout;
