import logo from "../assets/website-logo.svg"

const sidebarOptions = [
	{ iconName: "bi bi-house", name: "Home" },
	{ iconName: "bi bi-folder2", name: "Saved Projects" },
	{ iconName: "bi bi-globe2", name: "Community" },
];

const footerOptions = [
	{ iconName: "bi bi-gear", name: "Settings" },
	{ iconName: "bi bi-telephone", name: "Contact Us" },
	{ iconName: "bi bi-box-arrow-left", name: "Log out" },
];

interface SidebarProp {
	showSidebar: boolean;
}

function Sidebar(prop: SidebarProp) {
	return (
		<div
			className={`hidden lg:flex flex-col border-r border-gray-300 ${prop.showSidebar ? "p-8" : "p-5"} items-center gap-7 overflow-hidden transition-all duration-300`}
			style={{ width: prop.showSidebar ? "20rem" : "5rem" }}
		>
			<div className="flex gap-2 items-center transition-opacity duration-300">
				<img className="w-10 h-10 aspect-square" src={logo}></img>
				{prop.showSidebar && (
					<span className="hidden md:flex text-2xl font-bold">
						GraphAI
					</span>
				)}
			</div>

			<div
				className={
					"flex flex-col h-full justify-between " +
					(prop.showSidebar ? "w-full" : "")
				}
			>
				<div className="flex flex-col gap-2">
					{sidebarOptions.map((item, index) => (
						<div
							className={
								"rounded-2xl hover:bg-gray-200 transition-all p-2 flex items-center lg:gap-3 " +
								(!prop.showSidebar && "justify-center")
							}
							key={index}
						>
							<i
								className={`${item.iconName} font-medium text-xl`}
							></i>
							{prop.showSidebar && (
								<span className="hidden lg:flex">
									{item.name}
								</span>
							)}
						</div>
					))}
				</div>

				<div className="flex flex-col gap-2 w-full border-t pt-10 border-gray-300">
					{footerOptions.map((item, index) => (
						<div
							className={
								"rounded-2xl hover:bg-gray-200 transition-all p-2 flex items-center lg:gap-3 " +
								(!prop.showSidebar && "justify-center")
							}
							key={index}
						>
							<i
								className={`${item.iconName} font-medium text-xl`}
							></i>
							{prop.showSidebar && (
								<span className="hidden lg:flex">
									{item.name}
								</span>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default Sidebar;
