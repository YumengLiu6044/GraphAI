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
import { useState } from "react";

export default function ColumnSelector() {
	const isLoading = useColumnSearchStore((state) => state.isLoading);
	const data = useColumnSearchStore((state) => state.data);

	const [globalCheckboxSelected, setGlobalCheckboxSelected] = useState(false);
	const { toggleRow: setRowChecked, setData } =
		useColumnSearchStore.getState();
	function handleRowClick(index: number) {
		setRowChecked(index);
		if (globalCheckboxSelected) {
			setGlobalCheckboxSelected(false)
		}
	}

	function handleGlobalCheckboxClick() {
		const oldState = globalCheckboxSelected;
		setGlobalCheckboxSelected(!oldState);
		setData(data.map((item) => ({
			...item,
			isSelected: !oldState
		})));
	}

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
				<ScrollArea className="h-100 whitespace-nowrap cursor-pointer ">
					<Table>
						<TableCaption>Sample data from dataset</TableCaption>
						<TableHeader>
							<TableRow>
								<TableHead>
									<i
										className={`text-gray-400 bi ${
											globalCheckboxSelected
												? "bi-check-square"
												: "bi-square"
										}`}
										onClick={handleGlobalCheckboxClick}
									></i>
								</TableHead>
								<TableHead className="text-gray-400">Column Name</TableHead>
								<TableHead className="text-gray-400">Row 0</TableHead>
								<TableHead className="text-gray-400">Row 1</TableHead>
								<TableHead className="text-gray-400">Row 2</TableHead>
								<TableHead className="text-gray-400">Row 3</TableHead>
								<TableHead className="text-gray-400">Row 4</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data !== null &&
								data.map((item, index) => (
									<TableRow key={index} className={item.isSelected ? "bg-muted/50" : ""}>
										<TableCell>
											<i
												className={`bi ${
													item.isSelected
														? "bi-check-square"
														: "bi-square"
												}`}
												onClick={() =>
													handleRowClick(index)
												}
											></i>
										</TableCell>

										<TableCell className="font-medium">
											{item.column_name}
										</TableCell>
										<TableCell>{item.row_0}</TableCell>
										<TableCell>{item.row_1}</TableCell>
										<TableCell>{item.row_2}</TableCell>
										<TableCell>{item.row_3}</TableCell>
										<TableCell>{item.row_4}</TableCell>
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
