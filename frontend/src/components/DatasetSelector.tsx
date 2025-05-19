import { Handle, Position } from "@xyflow/react";

export default function DatasetSelector() {
  return (
    <div>
      <div className="flex flex-col card-box p-2 bg-white">
        <span className="text-xl font-medium"><i className="bi bi-database pr-2"></i>Dataset Selector</span>
        <span className="text-sm text-gray-500">Search Kaggle datasets or upload local CSV files</span>
      </div>
      <Handle type="source" position={Position.Right}></Handle>     
    </div>
  )
}
