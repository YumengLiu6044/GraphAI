import { create } from "zustand";
import type { ShowSidebarStore } from "./types";

export const useShowSidebarStore = create<ShowSidebarStore>((set) => ({
	doShow: true,
	setShow: (newState: boolean) => set(() => ({ doShow: newState })),
}));
