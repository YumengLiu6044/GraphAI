import { Handle, Position } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Upload from "./upload";
import SearchKaggle from "./search-kaggle";

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
