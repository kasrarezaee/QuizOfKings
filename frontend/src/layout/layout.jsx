import { Outlet , useLocation } from "react-router-dom";
import Navbar from "../components/navbar";

const Layout = ()=>{
    const location = useLocation()
    const hideNavbarPaths = ['/login' , '/signup']

    const shouldHideNavbar = hideNavbarPaths.includes(location.pathname)

    return (
        <>
            {!shouldHideNavbar && <Navbar/>}
            <Outlet/>
        </>
    )
}

export default Layout