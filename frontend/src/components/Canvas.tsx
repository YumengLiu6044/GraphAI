import {
	ReactFlow,
	Background,
	BackgroundVariant,
	Controls,
	Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useShowSidebarStore } from "../utils/store";

export default function Canvas() {
	const showSidebar = useShowSidebarStore((state) => state.doShow);
	const setShowSidebar = useShowSidebarStore((state) => state.setShow);

	return (
		<div className="w-full min-h-full">
			<ReactFlow>
				<Background
					variant={BackgroundVariant.Dots}
					gap={12}
					size={1.2}
				/>
				<Controls></Controls>
				<Panel>
					<i className="bi bi-list border-1 border-gray-300 bg-white rounded-md p-1 text-lg hover:bg-gray-200" onClick={() => setShowSidebar(!showSidebar)}></i>
				</Panel>
			</ReactFlow>
		</div>
	);
}
