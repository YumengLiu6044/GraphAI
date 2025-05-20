import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";


function MainLayout() {
	return (
		<div className="flex flex-col min-h-screen">
			<Navbar></Navbar>
			<Outlet></Outlet>
			<Footer></Footer>
		</div>
	);
}

export default MainLayout;