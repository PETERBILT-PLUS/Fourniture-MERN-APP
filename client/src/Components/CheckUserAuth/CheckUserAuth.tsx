import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
function CheckUserAuth() {
    const authUser = useSelector((state: any) => state.user.user);
    return (
        <>
            {authUser ? <Outlet /> : <Navigate to="/login" />}
        </>
    )
}

export default CheckUserAuth;