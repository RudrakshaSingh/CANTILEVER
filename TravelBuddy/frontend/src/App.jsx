import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import UserRegister from "./Pages/Users/UserRegister";
import UserLogin from "./Pages/Users/UserLogin";
import ForgotPassword from "./Pages/Users/ForgotPassword";
import HomeLayout from "./components/HomeLayout";
import ProtectedRoute from "./Helpers/ProtectedRoute";
import UserProfile from "./Pages/Users/UserProfile";
import CreateActivity from "./Pages/Activity/CreateActivity";
import MyActivities from "./Pages/Activity/MyActivities";
import DiscoverOtherTravellerNearYou from "./Pages/Users/DiscoverOtherTravellerNearYou";
import FindNearbyActivities from "./Pages/Activity/FindNearbyActivities";
import SingleActivity from "./Pages/Activity/SingleActivity";
import Error from "./Pages/Error";
import { useEffect } from "react";

function App() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]); // Trigger on pathname change
  return (
    <Routes>
      <Route path="/" element={<HomeLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/forgot-password" element={<ForgotPassword />} />

        <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
          <Route path="/user/profile" element={<UserProfile />} />
          <Route path="/activity/create" element={<CreateActivity />} />
          <Route path="/activity/my" element={<MyActivities />} />
          <Route path="/discover" element={<DiscoverOtherTravellerNearYou />} />
          <Route path="/activity/nearby" element={<FindNearbyActivities />} />
          <Route path="/activity/:activityId" element={<SingleActivity />} />
        </Route>
      </Route>

      <Route path="*" element={<Error />} />
    </Routes>
  );
}

export default App;
