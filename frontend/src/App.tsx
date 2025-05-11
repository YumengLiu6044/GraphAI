import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./pages/layout";
import Home from "./pages/home";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Workspace from "./pages/workspace";

export default function App() {
	return (
		<div>
			<BrowserRouter>
				<Routes>
					<Route element={<MainLayout />}>
            <Route path="/" element={<Home/>} ></Route>
						
					</Route>
					<Route path="/workspace" element={<Workspace/>}></Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
}
