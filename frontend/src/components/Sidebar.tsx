import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { SidebarOption } from "../utils/types";

const mainOptions: SidebarOption[] = [
	{
		iconName: "bi bi-folder",
		action: "Open",
		shortcut: "cmd + o",
	},
	{
		iconName: "bi bi-download",
		action: "Download",
		shortcut: "cmd + d",
	},
	{
		iconName: "bi bi-search",
		action: "Find",
		shortcut: "cmd + f",
	},
	{
		iconName: "bi bi-trash",
		action: "Clear",
		shortcut: "",
	},
	{
		iconName: "bi bi-arrow-counterclockwise",
		action: "Undo",
		shortcut: "cmd + z",
	},
];

const secondaryOptions: SidebarOption[] = [
	{
		iconName: "bi bi-house",
		action: "Home",
		shortcut: "",
		onClick(navigate) {
				if (navigate) {
					navigate("/")
				}
		},
	},
	{
		iconName: "bi bi-box-arrow-left",
		action: "Sign up",
		shortcut: "",
	},
	{
		iconName: "bi bi-github",
		action: "Github",
		shortcut: "",
	},
];

function Sidebar() {
	const [showSidebar, setShowSidebar] = useState(false);
	const navigate = useNavigate();

	return (
		<div className="flex flex-col gap-3 items-start">
			<i
				className="card-box p-1 bi bi-list bg-white text-lg hover:bg-gray-200"
				onClick={() => setShowSidebar(!showSidebar)}
			></i>
			{showSidebar && (
				<div className="card-box flex flex-col gap-1 bg-white p-2 border-b-1 border-gray-300">
					{mainOptions.map((item, index) => (
						<div
							key={index}
							className="flex justify-between rounded-md items-center hover:bg-purple-200 p-1"
							onClick={item.onClick?.call}
						>
							<span className="pr-5 font-light text-sm">
								<i className={`${item.iconName} px-2`}></i>
								{item.action}
							</span>
							<span className="text-gray-500 font-light text-sm">
								{item.shortcut}
							</span>
						</div>
					))}
					<div className="border-t-1 border-gray-300 my-2"></div>
					{secondaryOptions.map((item, index) => (
						<div
							key={index}
							className="flex justify-between rounded-md items-center hover:bg-purple-200 p-1"
							onClick={() => item.onClick?.(navigate)}
						>
							<span className="pr-5 font-light text-sm">
								<i className={`${item.iconName} px-2`}></i>
								{item.action}
							</span>
							<span className="text-gray-500">
								{item.shortcut}
							</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default Sidebar;
