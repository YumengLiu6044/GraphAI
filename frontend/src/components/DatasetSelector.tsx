import { Handle, Position } from "@xyflow/react";
import { useState } from "react";

const tabs = [
	{ label: "Search Kaggle", iconName: "bi bi-search " },
	{ label: "Upload", iconName: "bi bi-upload " },
];

function SearchKaggle() {
	return (
		<div className="flex flex-col items-start text-sm">
			<div className="flex w-full gap-2">
			  <div className="relative w-full">
			    <input
    				type="text"
    				className="rounded-md border-1 border-gray-300 w-full p-1 pl-7 font-light"
    				placeholder="Search Kaggle datasets"
    				onChange={()=>{}}
    			></input>
          <i className="bi bi-search absolute top-1/2 -translate-y-1/2 left-2 text-gray-400"></i>
			  </div>
        <span className="rounded-md bg-purple-500 text-white p-1 font-light">Search</span>
			</div>
		</div>
	);
}

function Upload() {
	return (
		<div className="flex flex-col justify-center items-center p-4 border-1 border-dashed rounded-md border-gray-300">
			<i className="bi bi-upload text-xl"></i>
			<span>Drag and drop your CSV file</span>
			<span className="text-sm text-gray-500">
				or click to browse your files
			</span>
			<span className="text-sm text-gray-500 pt-3">
				Maximum file size: 10MB
			</span>
		</div>
	);
}

export default function DatasetSelector() {
	const [selectedIndex, setSelectedIndex] = useState(0);

	return (
		<div>
			<div className="flex flex-col gap-4 card-box p-4 bg-white">
				<div className="flex flex-col">
				  <span className="text-xl font-medium">
  					<i className="bi bi-database pr-2"></i>Dataset Selector
  				</span>
  				<span className="text-sm text-gray-500">
  					Search Kaggle datasets or upload local CSV files
  				</span>
				</div>

				{/* Tab selector */}
				<div className="flex justify-around p-1 rounded-md bg-gray-200/70">
					{tabs.map((item, index) => (
						<div
							className={`flex justify-center w-full text-sm rounded-md ${
								selectedIndex === index
									? "text-black bg-white"
									: "text-gray-500"
							}`}
							key={index}
							onClick={() => setSelectedIndex(index)}
						>
							<span>
								<i className={`${item.iconName} pr-2`}></i>
								{item.label}
							</span>
						</div>
					))}
				</div>

				{selectedIndex === 0 ? (
					<SearchKaggle></SearchKaggle>
				) : (
					<Upload></Upload>
				)}
			</div>
			<Handle type="source" position={Position.Right}></Handle>
		</div>
	);
}
