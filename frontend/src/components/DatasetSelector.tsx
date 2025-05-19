import { Handle, Position } from "@xyflow/react";
import { useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DualRangeSlider } from '@/components/ui/dual-range-slider';


const tabs = [
	{ label: "Search Kaggle", iconName: "bi bi-search " },
	{ label: "Upload", iconName: "bi bi-upload " },
];

const kaggleSearchTags = [
	"Computer Vision",
	"NLP",
	"Time Series",
	"Computer Science",
	"Education",
];

function SearchKaggle() {
	const [showSearchOptions, setShowSearchOptions] = useState(false);
	const [sortOption, setSortOption] = useState("hottest");
	const [fileSizeLimit, setFileSizeLimit] = useState([0, 10]);

	return (
		<div className="flex flex-col items-start text-sm">
			<div className="flex w-full gap-2 items-center">
				<div className="relative w-full">
					<input
						type="text"
						className="rounded-md border-1 border-gray-300 w-full p-1 pl-7 font-light"
						placeholder="Search Kaggle datasets"
						onChange={() => {}}
					></input>
					<i className="bi bi-search absolute top-1/2 -translate-y-1/2 left-2 text-gray-400"></i>
				</div>
				<i
					className="bi bi-funnel text-lg"
					onClick={() => setShowSearchOptions(!showSearchOptions)}
				></i>
			</div>
			{showSearchOptions && (
				<div className="w-full flex flex-col gap-3">
					<hr className="text-gray-300 my-3"></hr>
					<div className="flex flex-col gap-2">
						<Label
							htmlFor="search-tags"
							className="text-sm font-medium"
						>
							Tags
						</Label>
						<div className="flex flex-wrap gap-2 max-w-70">
							{kaggleSearchTags.map((item, index) => (
								<button
									className="text-center px-1.5 rounded-xl border-1 border-gray-300 text-sm hover:border-black"
									key={index}
								>
									{item}
								</button>
							))}
						</div>
					</div>
					{/* Sort options */}
					{/* <div>
						<Label className="text-sm font-medium">Sort By</Label>
						<Select
							value={sortOption}
							onValueChange={setSortOption}
						>
							<SelectTrigger className="mt-1">
								<SelectValue placeholder="Select sort option" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="hottest">Hottest</SelectItem>
								<SelectItem value="votes">Votes</SelectItem>
								<SelectItem value="updated">Updated</SelectItem>
								<SelectItem value="active">Active</SelectItem>
							</SelectContent>
						</Select>
					</div> */}

					<div className="pb-4">
						<div className="flex justify-between items-center">
							<Label
								htmlFor="file-size"
								className="text-sm font-medium"
							>
								File Size Limit
							</Label>
						</div>
						<DualRangeSlider
							id="file-size"
              labelPosition="bottom"
							className="mt-2"
							value={fileSizeLimit}
							min={0}
							max={10}
							step={0.1}
              label={(value) => <span className="text-sm">{value}MB</span>}
							onValueChange={setFileSizeLimit}
						/>
					</div>
				</div>
			)}
		</div>
	);
}

function Upload() {
	return (
		<button className="flex flex-col justify-center items-center p-4 border-1 border-dashed rounded-md border-gray-300 hover:border-gray-500">
			<i className="bi bi-upload text-xl"></i>
			<span>Drag and drop your CSV file</span>
			<span className="text-sm text-gray-500">
				or click to browse your files
			</span>
			<span className="text-sm text-gray-500 pt-3">
				Maximum file size: 10MB
			</span>
		</button>
	);
}

export default function DatasetSelector() {
	const [selectedTabIndex, setSelectedTabIndex] = useState(0);

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
								selectedTabIndex === index
									? "text-black bg-white"
									: "text-gray-500"
							}`}
							key={index}
							onClick={() => setSelectedTabIndex(index)}
						>
							<button>
								<i className={`${item.iconName} pr-2`}></i>
								{item.label}
							</button>
						</div>
					))}
				</div>

				{selectedTabIndex === 0 ? (
					<SearchKaggle></SearchKaggle>
				) : (
					<Upload></Upload>
				)}
			</div>
			<Handle type="source" position={Position.Right}></Handle>
		</div>
	);
}
