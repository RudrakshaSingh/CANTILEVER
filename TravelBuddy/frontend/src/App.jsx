import { Route, Routes } from "react-router-dom";
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

function App() {
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



          
        </Route>

        
      </Route>
      {/* Add more routes as needed */}
    </Routes>
  );
}

export default App;
