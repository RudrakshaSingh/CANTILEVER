import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ allowedRoles }) {
    let { user } = useSelector((state) => state.user);
    let role=user?.role
    return user && allowedRoles.find((myRole) => myRole == role) ? (
        <Outlet /> //renders child component in app.jsx
    ) : user ? (
        <Navigate to="/denied" /> //loggedin but not allowed role
    ) : (
        <Navigate to="/user/login" /> // not loggedin as well as not allowed role
    );
}

export default ProtectedRoute;