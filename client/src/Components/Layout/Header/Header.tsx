import { Link, NavLink, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import "./Header.css";
import { MdCancel } from "react-icons/md";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../Configurations/main.ts";
import axios, { AxiosResponse } from "axios";
import { logoutAdmin } from "../../../Configurations/admin.ts";
import { toast } from "react-toastify";
import useProduct from "../../../Configurations/basket.ts";
import LOGO from "../../../assets/myLOGO.jpeg";


function Header() {

    const [state, setState] = useState<boolean>(false);
    const authAdmin = useSelector((state: any) => state.admin.admin);
    const authUser = useSelector((state: any) => state.user.user);
    const [adminState, setAdminState] = useState<boolean>(false);
    const URL = import.meta.env.VITE_SERVER as string;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { setProducts, products } = useProduct();

    useEffect(() => {
        const checkState = async () => {
            if (!authAdmin && !authUser) return;
            try {
                const response: AxiosResponse<any, any> = await axios.get(`${URL}/check-state/get-state`, { withCredentials: true });
                if (response.data.success) {
                    setAdminState(response.data.isAdmin);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if ((authUser || authAdmin) && error.response?.data.message === "Token has expired") {
                        toast.warning("Token est expiré");
                        await new Promise((resolve) => setTimeout(resolve, 3500));
                        navigate("/login");
                    } else if ((authUser || authAdmin) && error.response?.data.message === "Invalid token") {
                        toast.warning(error.response?.data.message);
                        await new Promise((resolve) => setTimeout(resolve, 3500));
                        navigate("/login");
                    }
                    toast.warning(error.response?.data.message);
                    return false;
                }
                toast.error("An Error Happened. Try Later");
            }
        }
        checkState();
    }, [authUser, authAdmin]);

    useEffect(() => {
        const getBasket = async () => {
            try {
                const response: AxiosResponse<any, any> = await axios.get(`${URL}/user-basket/get-basket`, { withCredentials: true });
                if (response.data.success) {
                    if (response.data.data.products) {
                        setProducts([...response.data.data.products]);
                    }
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.warning(error.response?.data.message);
                } else {
                    console.error(error);
                    toast.error("An Error Happend");
                }
            }
        }

        if (authUser) getBasket();
    }, [authUser, setProducts]);

    const handleLogout = async () => {
        try {
            const response: AxiosResponse<any, any> = await axios.post(`${URL}/auth/logout`, null, { withCredentials: true });
            if (response.data.success) {
                dispatch(authUser ? logoutUser() : logoutAdmin());
                navigate("/login");
                toast.success("Déconnection Succès");
            }
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                toast.warning(error.response?.data?.message);
            } else {
                toast.error(error?.message);
            }
        }
    }

    return (
        <header className="py-2 flex flex-col justify-between items-center">
            <div className="container px-auto">

                <div className="px-8 md:px-12 lg:px-12 flex flex-row justify-between items-center">
                    <div>
                        <h1 className="text-2xl text-center cursor-pointer"><img className="w-24 h-24 py-0" src={LOGO} alt={"LOGO"} /></h1>
                    </div>

                    <div className="hidden lg:flex flex-row justify-between items-center gap-14 links">
                        <NavLink to="/" className={({ isActive }) => isActive ? "nav-link-active" : "nav-link"}>Acceul</NavLink>
                        <NavLink to="/products" className={({ isActive }) => isActive ? "nav-link-active" : "nav-link"}>Produits</NavLink>
                        <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link-active" : "nav-link"}>Contact</NavLink>
                    </div>

                    <div className="buttons hidden lg:flex flex-row justify-between items-center gap-8">
                        {authUser || authAdmin ? (
                            <>
                                {adminState || authUser ? (
                                    <div className="relative">
                                        <details className="dropdown">
                                            <summary className="btn m-1 px-8">Plus</summary>
                                            <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                                {adminState ? (
                                                    <>
                                                        <li><Link to="/admin/admin-orders">Ordres</Link></li>
                                                        <li><Link to="/admin/get-users">Utilisateurs</Link></li>
                                                        <li><Link to="/admin/get-products">produits</Link></li>
                                                        <li><Link to="/admin/create-listing">Ajouter un produit</Link></li>
                                                        <li><Link to="/admin/create-brand-and-category">Ajouter Brand et Produit</Link></li>
                                                    </>
                                                ) : (
                                                    <>
                                                        <li><Link to="/panier">Panier</Link></li>
                                                        <li><Link to="/orders">Ordres</Link></li>
                                                    </>
                                                )}
                                            </ul>
                                        </details>
                                    </div>
                                ) : null}
                                {!!authUser && <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                                    <Link to="/panier">
                                        <div className="indicator">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <span className="badge badge-sm indicator-item">{products.map((elem: any) => elem.quantity).reduce((acc, curr) => acc + curr, 0)}</span>
                                        </div>
                                    </Link>
                                </div>}
                                <button type="button" className="sign-out-btn" onClick={() => handleLogout()}>Déconnecter</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <button type="button" className="sign-in-button">Se connecter</button>
                                </Link>
                                <Link to="/register">
                                    <button type="button" className="create-account">Crée un compte</button>
                                </Link>
                            </>
                        )}
                    </div>


                    <div className="flex lg:hidden cursor-pointer">
                        {state ? <MdCancel size={24} color="#000" onClick={() => setState((prev) => !prev)} /> : <GiHamburgerMenu size={24} color="#000" onClick={() => setState((prev) => !prev)} />}
                    </div>
                </div>
            </div>

            {/* This is the mobile Navigation */}

            <nav className={`${state ? "mobile-navigation-active" : "mobile-navigation"} flex flex-col justify-start pt-14 gap-10 items-center lg:hidden`}>

                <div className="p-2">
                    <h1 className="text-2xl text-center cursor-pointer">LOGO</h1>
                </div>

                <div className="flex flex-col justify-evenly items-center">
                    <NavLink to="/" className={({ isActive }) => isActive ? "nav-link-active py-2" : "nav-link py-2"}>Acceul</NavLink>
                    <NavLink to="/products" className={({ isActive }) => isActive ? "nav-link-active py-2" : "nav-link py-2"}>Produits</NavLink>
                    <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link-active py-2" : "nav-link py-2"}>Contact</NavLink>
                </div>

                <div className="flex flex-col justify-evenly items-center">
                    <button type="button" className="sign-in-button my-2">Se connecter</button>
                    <button type="button" className="create-account my-2">Crée un compte</button>
                </div>

            </nav>
        </header >
    )
}

export default Header;
