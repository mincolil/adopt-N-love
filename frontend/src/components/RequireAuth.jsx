import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
    const context = useAuth();
    const location = useLocation();

    var count = 0;

    allowedRoles.map((value) => {
        if(context.auth?.role === value) count++
    })

    return (
        count === 1
            ? <Outlet />
            : <Navigate to="/sign-in" state={{ from: location }} replace />
    );
}

export default RequireAuth;