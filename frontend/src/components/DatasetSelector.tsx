import { Handle, Position } from "@xyflow/react";
import { useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { Switch } from "@/components/ui/switch";
import { DualRangeSlider } from "@/components/ui/dual-range-slider";
import type { DatasetSearchResponseItem } from "@/utils/types";
import DatasetCard from "./Dataset-Card";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const kaggleSearchTags = [
	"Computer Vision",
	"NLP",
	"Time Series",
	"Computer Science",
	"Education",
];

const sampleData: DatasetSearchResponseItem[] = [
	{
		title: "Global Land Cover 2020",
		owner: "NASA",
		last_updated: "2025-04-15T13:20:00Z",
		featured: true,
		votes: 342,
		size: 2048, // in MB
	},
	{
		title: "World Bank Economic Indicators",
		owner: "World Bank",
		last_updated: "2025-01-28T09:00:00Z",
		featured: false,
		votes: 189,
		size: 512,
	},
	{
		title: "OpenStreetMap Extract - Europe",
		owner: "OSM Contributors",
		last_updated: "2025-03-22T17:45:00Z",
		featured: true,
		votes: 412,
		size: 10240,
	},
	{
		title: "Global CO2 Emissions by Country",
		owner: "IEA",
		last_updated: "2024-11-10T08:15:00Z",
		featured: false,
		votes: 230,
		size: 768,
	},
	{
		title: "Satellite Imagery - Amazon Rainforest",
		owner: "ESA",
		last_updated: "2025-05-05T14:30:00Z",
		featured: true,
		votes: 540,
		size: 15000,
	},
];

function SearchKaggle() {
	const [sortOption, setSortOption] = useState("hottest");
	const [fileSizeLimit, setFileSizeLimit] = useState([0, 10]);

	return (
		<div className="flex flex-col gap-4 items-start text-sm">
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
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<i className="bi bi-funnel text-lg hover:scale-110"></i>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="start"
						side="right"
						sideOffset={20}
					>
						<div className="flex flex-col gap-3 p-3">
							<div className="flex justify-between">
								<div className="flex gap-2 items-center">
									<label className="text-sm font-medium">
										Search By
									</label>
									<Select
										value={sortOption}
										onValueChange={setSortOption}
									>
										<SelectTrigger className="mt-1">
											<SelectValue placeholder="Select sort option" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="hottest">
												Hottest
											</SelectItem>
											<SelectItem value="votes">
												Votes
											</SelectItem>
											<SelectItem value="updated">
												Updated
											</SelectItem>
											<SelectItem value="active">
												Active
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="flex items-center gap-2">
									<label
										className="text-sm font-medium"
										htmlFor="feature-only-switch"
									>
										Show Featured Only
									</label>
									<Switch id="feature-only-switch"></Switch>
								</div>
							</div>
							<div className="flex flex-col gap-2">
								<label
									htmlFor="search-tags"
									className="text-sm font-medium"
								>
									Tags
								</label>
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

							<div className="pb-4">
								<div className="flex justify-between items-center">
									<label
										htmlFor="file-size"
										className="text-sm font-medium"
									>
										File Size Limit
									</label>
								</div>
								<DualRangeSlider
									id="file-size"
									labelPosition="bottom"
									className="mt-2"
									value={fileSizeLimit}
									min={0}
									max={10}
									step={0.1}
									label={(value) => (
										<span className="text-sm">
											{value}MB
										</span>
									)}
									onValueChange={setFileSizeLimit}
								/>
							</div>
						</div>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="flex flex-col gap-2 w-full">
				{sampleData.map((item, index) => (
					<div key={index}>
						<DatasetCard info={item}></DatasetCard>
					</div>
				))}
			</div>
		</div>
	);
}

function Upload() {
	return (
		<button className="w-full flex flex-col justify-center items-center p-4 py-10 border-1 border-dashed rounded-md border-gray-300 hover:border-gray-500">
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
	return (
		<div className="w-120">
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
				<Tabs defaultValue="search">
					<TabsList className="w-full flex justify-around mb-4">
						<TabsTrigger value="search">
							<i className="bi bi-search"></i>
							Search Kaggle
						</TabsTrigger>
						<TabsTrigger value="upload">
							<i className="bi bi-upload"></i>
							Upload CSV
						</TabsTrigger>
					</TabsList>
					<TabsContent value="search">
						<SearchKaggle></SearchKaggle>
					</TabsContent>
					<TabsContent value="upload">
						<Upload></Upload>
					</TabsContent>
				</Tabs>

				<div className="flex justify-end">
					<Button size={"lg"} className="font-light">
						Next
					</Button>
				</div>
			</div>
			<Handle type="source" position={Position.Right}></Handle>
		</div>
	);
}
