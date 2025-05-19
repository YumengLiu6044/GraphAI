import type { NavigateFunction } from "react-router-dom"


export type SidebarOption = {
	iconName: string,
	action: string,
	shortcut?: string,
	onClick?: (navigate?: NavigateFunction) => void
}