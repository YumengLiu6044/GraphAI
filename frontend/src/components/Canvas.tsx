import {
	ReactFlow,
	Background,
	BackgroundVariant,
	Controls,
	Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useShowSidebarStore } from "../utils/store";
import { useState } from "react";

const toolbarButtons = [
		{ name: "bi bi-hand-index", isSelected: false },
		{ name: "bi bi-vector-pen", isSelected: false },
		{ name: "bi bi-chat-left-text", isSelected: false },
		{ name: "bi bi-eraser", isSelected: false },
	]

export default function Canvas() {
	const showSidebar = useShowSidebarStore((state) => state.doShow);
	const setShowSidebar = useShowSidebarStore((state) => state.setShow);

  const [selectedToolIndex, setSelectedToolIndex] = useState(0)

	const nodes = [
		{
			id: "1", // required
			position: { x: 0, y: 0 }, // required
			data: { label: "Hello" }, // required
		},
	];


	return (
		<div className="w-full min-h-full">
			<ReactFlow nodes={nodes}>
				<Background
					variant={BackgroundVariant.Dots}
					gap={12}
					size={1}
				/>
				<Controls></Controls>

				{/* sidebar control button */}
				<Panel>
					<i
						className="card-box bi bi-list bg-white text-lg hover:bg-gray-200"
						onClick={() => setShowSidebar(!showSidebar)}
					></i>
				</Panel>

				{/* Toolbar */}
				<Panel position="bottom-center">
					<div className="flex card-box bg-white gap-8 ">
						{toolbarButtons.map((item, index) => (
							<i
								className={`${item.name} rounded-md p-2 ${index === selectedToolIndex ? "bg-purple-400/50" : "hover:bg-gray-200"}`}
								key={index}
                onClick={() => setSelectedToolIndex(index)}
							></i>
						))}
					</div>
				</Panel>
			</ReactFlow>
		</div>
	);
}
