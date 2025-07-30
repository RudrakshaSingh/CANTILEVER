import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import UserRegister from "./pages/UserRegister";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import UserLogin from "./pages/UserLogin";
import SpecificNews from "./pages/SpecificNews";
import ForgotPassword from "./pages/ForgotPassword";
import Error from "./pages/Error";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<UserRegister />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/news/:id" element={<SpecificNews />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Terms and Privacy */}
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />

      {/* 404 page */}
      <Route path="*" element={<Error />} />
    </Routes>
  );
}

export default App;
