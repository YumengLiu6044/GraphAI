import { Handle, Position } from "@xyflow/react";

export default function ColumnSelector() {
  

	return (
		<div className="w-80 flex flex-col gap-4 card-box p-4 bg-white fadeIn">
			<div className="flex flex-col">
				<span className="text-xl font-medium">
					<i className="bi bi-3-circle pr-2"></i>Configure Dataset
				</span>
				<span className="text-sm text-gray-500">
					 Prepare the dataset for training
				</span>
			</div>


			<Handle type="target" position={Position.Left} />
			<Handle type="source" position={Position.Right} />
		</div>
	);
}
