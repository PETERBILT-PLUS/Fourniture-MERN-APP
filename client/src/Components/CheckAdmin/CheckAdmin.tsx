import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';

function CheckAdmin() {
    const authAdmin = useSelector((state: any) => state.admin.admin);
    return (
        <>
            {authAdmin ? <Outlet /> : <Navigate to="/" />}
        </>
    )
}

export default CheckAdmin;