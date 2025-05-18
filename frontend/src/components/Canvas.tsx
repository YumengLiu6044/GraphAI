import {
	ReactFlow,
	Background,
	BackgroundVariant,
	Controls,
	Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useShowSidebarStore } from "../utils/store";

const toolbarIcons = [
  {name: "bi bi-cursor"},
  {name: "bi bi-vector-pen"},
    {name: "bi bi-chat-left-text"},
  {name: "bi bi-eraser"}
]

export default function Canvas() {
	const showSidebar = useShowSidebarStore((state) => state.doShow);
	const setShowSidebar = useShowSidebarStore((state) => state.setShow);

  const nodes = [
  {
    id: '1', // required
    position: { x: 0, y: 0 }, // required
    data: { label: 'Hello' }, // required
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
					<i className="card-box bi bi-list bg-white text-lg hover:bg-gray-200" onClick={() => setShowSidebar(!showSidebar)}></i>
				</Panel>

        {/* Toolbar */}
        <Panel position="bottom-center">
          <div className="flex card-box bg-white gap-8 ">
            {toolbarIcons.map((item, index) => (<i className={`${item.name} hover:bg-gray-200 rounded-md p-2`} key={index}></i>))}
          </div>
        </Panel>
       


			</ReactFlow>
		</div>
	);
}
