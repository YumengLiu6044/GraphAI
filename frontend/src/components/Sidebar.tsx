import { Link } from "react-router-dom";
import logo from "../assets/website-logo.svg"
import { useShowSidebarStore } from "../utils/store";

const sidebarOptions = [
	{ iconName: "bi bi-house", name: "Home", link: "../" },
	{ iconName: "bi bi-folder2", name: "Saved Projects", link: "/" },
	{ iconName: "bi bi-globe2", name: "Community", link: "/" },
];

const footerOptions = [
	{ iconName: "bi bi-gear", name: "Settings", link: "/" },
	{ iconName: "bi bi-telephone", name: "Contact Us", link: "/" },
	{ iconName: "bi bi-box-arrow-left", name: "Log out", link: "/" },
];

function Sidebar() {
	const showSidebar = useShowSidebarStore((state) => state.doShow)
	return (
		<div
			className={`hidden lg:flex flex-col border-r border-gray-300 ${showSidebar ? "p-8" : "p-5"} items-center gap-7 overflow-hidden transition-all duration-300`}
			style={{ width: showSidebar ? "20rem" : "5rem" }}
		>
			<div className="flex gap-2 items-center transition-opacity duration-300 pb-5">
				<img className="w-10 h-10 aspect-square" src={logo}></img>
				{showSidebar && (
					<span className="hidden md:flex text-2xl font-bold">
						GraphAI
					</span>
				)}
			</div>

			<div
				className={
					"flex flex-col h-full justify-between " +
					(showSidebar ? "w-full" : "")
				}
			>
				<div className="flex flex-col gap-2">
					{sidebarOptions.map((item, index) => (
						<Link to={item.link}
							className={
								"rounded-2xl hover:bg-gray-200 transition-all p-2 flex items-center lg:gap-3 " +
								(!showSidebar && "justify-center")
							}
							key={index}
						>
							<i
								className={`${item.iconName} font-medium text-xl`}
							></i>
							{showSidebar && (
								<span className="hidden lg:flex">
									{item.name}
								</span>
							)}
						</Link>
					))}
				</div>

				<div className="flex flex-col gap-2 w-full border-t pt-10 border-gray-300">
					{footerOptions.map((item, index) => (
						<Link
						to={item.link}
							className={
								"rounded-2xl hover:bg-gray-200 transition-all p-2 flex items-center lg:gap-3 " +
								(!showSidebar && "justify-center")
							}
							key={index}
						>
							<i
								className={`${item.iconName} font-medium text-xl`}
							></i>
							{showSidebar && (
								<span className="hidden lg:flex">
									{item.name}
								</span>
							)}
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}

export default Sidebar;
