import { useNavigate } from "react-router-dom";
import type { SidebarOption } from "../utils/types";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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
				navigate("/");
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
	const navigate = useNavigate();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<i className="card-box p-1 bi bi-list bg-white text-lg hover:bg-gray-200"></i>
			</DropdownMenuTrigger>
			<DropdownMenuContent sideOffset={0} align="start">
				{mainOptions.map((item, index) => (
					<DropdownMenuItem
						key={index}
						className="flex justify-between"
						onClick={() => item.onClick?.(navigate)}
					>
						<span className="pr-5 font-light text-sm">
							<i className={`${item.iconName} px-2`}></i>
							{item.action}
						</span>
						<span className="text-gray-500 font-light text-sm">
							{item.shortcut}
						</span>
					</DropdownMenuItem>
				))}
				<DropdownMenuSeparator></DropdownMenuSeparator>
				{secondaryOptions.map((item, index) => (
					<DropdownMenuItem
						key={index}
						className="flex justify-between"
						onClick={() => item.onClick?.(navigate)}
					>
						<span className="pr-5 font-light text-sm">
							<i className={`${item.iconName} px-2`}></i>
							{item.action}
						</span>
						<span className="text-gray-500 font-light text-sm">
							{item.shortcut}
						</span>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default Sidebar;
