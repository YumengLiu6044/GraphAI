import { Handle, Position } from "@xyflow/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Upload from "./upload";
import SearchKaggle from "./search-kaggle";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import FileSelector from "./file-selector";
import ColumnSelector from "./column-selector";
import { getDatasetColumns, searchDataset, searchDatasetFiles } from "@/utils/fetch";

export default function DatasetSelector() {
	const [step, setStep] = useState(1);

	useEffect(() => {
		searchDataset();
	}, []);

	function handleNextClick() {
		switch (step) {
			case 1:
				searchDatasetFiles();
				break;

				case 2:
					getDatasetColumns();
					break;

			default:
				break;
		}
	}

	return (
		<div className="w-150">
			<div className="flex flex-col gap-4 card-box p-6 bg-white">
				{/* Progress Indicator */}
				<div className="flex gap-2 w-full items-center justify-between">
					<div className="flex items-center gap-2">
						<div
							className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
								step >= 1
									? "btn-purple-gradient"
									: "border-2 border-gray-300 text-gray-400 bg-white"
							}`}
						>
							<div
								className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
									step >= 1
										? "btn-purple-gradient"
										: "border-2 border-gray-300 text-gray-400 bg-white"
								}`}
							>
								1
							</div>
						</div>
					</div>
					<div
						className={`h-1 w-full rounded-full transition-colors ${
							step >= 2 ? "bg-purple-500" : "bg-gray-200"
						}`}
					></div>
					<div className="flex items-center gap-2">
						<div
							className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
								step >= 2
									? "btn-purple-gradient"
									: "border-2 border-gray-300 text-gray-400 bg-white"
							}`}
						>
							2
						</div>
					</div>
					<div
						className={`h-1 w-full rounded-full transition-colors ${
							step >= 3 ? "bg-purple-500" : "bg-gray-200"
						}`}
					></div>
					<div className="flex items-center gap-2">
						<div
							className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
								step >= 3
									? "btn-purple-gradient"
									: "border-2 border-gray-300 text-gray-400 bg-white"
							}`}
						>
							3
						</div>
					</div>
				</div>

				{step === 1 && (
					<div className="flex flex-col gap-4">
						<div className="flex flex-col">
							<span className="text-xl font-medium">
								Choose Dataset
							</span>
							<span className="text-sm text-gray-500">
								Search Kaggle datasets or upload local CSV files
							</span>
						</div>
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
					</div>
				)}
				{step === 2 && <FileSelector></FileSelector>}
				{step === 3 && <ColumnSelector></ColumnSelector>}

				<div className="flex justify-between">
					{step > 1 ? (
						<Button
							variant="outline"
							onClick={() => setStep(step - 1)}
							className="border-purple-600 hover:bg-purple-200 text-purple-600"
						>
							Back
						</Button>
					) : (
						<div></div>
					)}

					{step < 3 ? (
						<Button
							onClick={() => {
								handleNextClick()
								setStep(step + 1);
							}}
							className="btn-purple-gradient"
						>
							Next
						</Button>
					) : (
						<Button className="btn-purple-gradient">
							Complete Setup
						</Button>
					)}
				</div>
			</div>
			<Handle type="source" position={Position.Right}></Handle>
		</div>
	);
}
