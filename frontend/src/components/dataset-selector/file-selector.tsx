import { useFileSearchStore } from "@/utils/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import loading from "../../assets/black_loading.svg";


export default function FileSelector() {
	const csvFiles = useFileSearchStore((state) => state.files);
	const selectedIndex = useFileSearchStore(
		(state) => state.selectedFileIndex
	);
	const { setSelectedFileIndex } = useFileSearchStore.getState();
	const isLoading = useFileSearchStore((state) => state.isLoading);


	function handleFileClick(index: number) {
		setSelectedFileIndex(index);
	}

	return (
		<div className="flex flex-col gap-4 fadeIn">
			<div className="flex flex-col">
				<span className="text-xl font-medium">
					Select an Input File
				</span>
				<span className="text-sm text-gray-500">
					Select a file to use as model input
				</span>
			</div>

			<ScrollArea className="h-70 w-full rounded-md">
				{isLoading ? (
					<div className="flex justify-center w-full">
						<img src={loading} className="w-12"></img>
					</div>
				) : (
					<div className="p-1 flex flex-col gap-2">
						{csvFiles.map((item, index) => (
							<div
								className={
									"flex justify-between items-center rounded-md p-1 " +
									(selectedIndex === index
										? "outline-black outline-1"
										: "hover:bg-accent/50")
								}
								key={index}
								onClick={() => handleFileClick(index)}
							>
								<span className="truncate max-w-45">
									<i className="bi bi-file-earmark-text pr-2"></i>
									{item.fileName}
								</span>
								<span className="text-sm text-muted-foreground">
									Size:{" "}
									{(item.fileSize / 1024 / 1024).toFixed(1)}MB
								</span>
							</div>
						))}
					</div>
				)}
			</ScrollArea>
		</div>
	);
}
