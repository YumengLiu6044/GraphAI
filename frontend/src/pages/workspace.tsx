import {
	ReactFlow,
	Background,
	BackgroundVariant,
	Controls,
	Panel,
	PanOnScrollMode,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useState } from "react";
import DatasetSelector from "../components/dataset-selector/dataset-selector";
import Sidebar from "@/components/navigation/sidebar";

const toolbarButtons = [
	{ name: "bi bi-hand-index" },
	{ name: "bi bi-vector-pen" },
	{ name: "bi bi-chat-left-text" },
	{ name: "bi bi-eraser" },
];

const nodeTypes = {
	datasetSelector: DatasetSelector,
};

const nodes = [
	{
		id: "dataset-selector",
		type: "datasetSelector",
		position: { x: window.screen.width / 4, y: 100 },
		data: {},
	},
];
export default function Workspace() {
	const [selectedToolIndex, setSelectedToolIndex] = useState(0);

	return (
		<div className="w-screen h-screen">
			<ReactFlow
				nodes={nodes}
				nodeTypes={nodeTypes}
				panOnDrag={selectedToolIndex === 0}
				panOnScroll={true}
				panOnScrollMode={PanOnScrollMode.Free}
				panOnScrollSpeed={0.7}
			>
				<Background
					variant={BackgroundVariant.Dots}
					gap={12}
					size={1}
				/>
				<Controls></Controls>

				{/* sidebar control button */}
				<Panel>
					<Sidebar></Sidebar>
				</Panel>

				{/* Toolbar */}
				<Panel position="bottom-center">
					<div className="flex card-box p-2 bg-white gap-8 ">
						{toolbarButtons.map((item, index) => (
							<i
								className={`${item.name} rounded-md p-2 ${
									index === selectedToolIndex
										? "bg-purple-400/50"
										: "hover:bg-gray-200"
								}`}
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
