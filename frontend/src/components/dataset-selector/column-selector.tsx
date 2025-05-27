import { useColumnSearchStore } from "@/utils/store";
import loading from "../../assets/black_loading.svg";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

export default function ColumnSelector() {
	const isLoading = useColumnSearchStore((state) => state.isLoading);
	const data = useColumnSearchStore((state) => state.data);

	return (
		<div className="flex flex-col gap-4 fadeIn">
			<div className="flex flex-col">
				<span className="text-xl font-medium">Configure Dataset</span>
				<span className="text-sm text-gray-500">
					Select columns used as target and input
				</span>
			</div>

			{isLoading ? (
				<div className="flex justify-center w-full">
					<img src={loading} className="w-12"></img>
				</div>
			) : (
				<ScrollArea className="h-100 whitespace-nowrap">
					<Table>
						<TableCaption>Sample data from dataset</TableCaption>
						<TableHeader>
							<TableRow>
								<TableHead>
									<i className="bi bi-square"></i>
								</TableHead>
								<TableHead>Column Name</TableHead>
								<TableHead>Row 0</TableHead>
								<TableHead>Row 1</TableHead>
								<TableHead>Row 2</TableHead>
								<TableHead>Row 3</TableHead>
								<TableHead>Row 4</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data !== null && data.map((item, index) => (
								<TableRow key={index}>
									<TableCell>
										<i className="bi bi-square"></i>
									</TableCell>

									<TableCell className="font-medium">
										{item.column_name}
									</TableCell>
									<TableCell>{item["Row 0"]}</TableCell>
									<TableCell>{item["Row 1"]}</TableCell>
									<TableCell>{item["Row 2"]}</TableCell>
									<TableCell>{item["Row 3"]}</TableCell>
									<TableCell>{item["Row 4"]}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					<ScrollBar orientation="horizontal"></ScrollBar>
				</ScrollArea>
			)}
		</div>
	);
}
