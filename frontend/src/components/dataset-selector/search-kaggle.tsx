import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DualRangeSlider } from "@/components/ui/dual-range-slider";
import type { SearchTag } from "@/utils/types";
import DatasetCard from "./dataset-card";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	useDatasetSearchRequestStore,
	useDatasetSearchResponseStore,
} from "@/utils/store";
import { useEffect, useState } from "react";
import { searchDataset } from "@/utils/fetch";

const selectOptions = [
	{ value: "hottest", label: "Hottest" },
	{ value: "votes", label: "Votes" },
	{ value: "updated", label: "Updated" },
	{ value: "active", label: "Active" },
];

export default function SearchKaggle() {
	const searchQuery = useDatasetSearchRequestStore((state) => state.search);
	const setSearchQuery = useDatasetSearchRequestStore(
		(state) => state.setSearch
	);

	const [undebouncedInput, setUndebouncedInput] = useState("");


	const minFileSize = useDatasetSearchRequestStore((state) => state.min_size);
	const maxFileSize = useDatasetSearchRequestStore((state) => state.max_size);
	const setFileSizeLimit = useDatasetSearchRequestStore(
		(state) => state.setFileSizeLimit
	);

	const searchOption = useDatasetSearchRequestStore(
		(state) => state.search_by
	);
	const setSearchOption = useDatasetSearchRequestStore(
		(state) => state.setSearchBy
	);

	const [openDropdown, setOpenDropdown] = useState(false);

	const setStoredSearchTags = useDatasetSearchRequestStore(
		(state) => state.setTagIds
	);
	const [searchTags, setSearchTags] = useState<SearchTag[]>([
		{ label: "computer vision", isSelected: false },
		{ label: "computer science", isSelected: false },
		{ label: "begineer", isSelected: false },
		{ label: "time series", isSelected: false },
		{ label: "gpu", isSelected: false },
	]);

	const searchResult = useDatasetSearchResponseStore(
		(state) => state.response
	);
	const handleSearchTagClick = (index: number) => {
		let newSearchTags = [...searchTags];
		newSearchTags[index].isSelected = !newSearchTags[index].isSelected;
		setStoredSearchTags(newSearchTags.map((item) => item.label));
		setSearchTags(newSearchTags);
	};

	useEffect(() => {
		const handler = setTimeout(() => {
			setSearchQuery(undebouncedInput);
		}, 500);

		return () => {
			clearTimeout(handler);
		};
	}, [undebouncedInput]);

	useEffect(() => {
		searchDataset();
	}, [searchQuery]);

	return (
		<div className="flex flex-col gap-4 items-start text-sm">
			<div className="flex w-full gap-2 items-center">
				<div className="relative w-full">
					<input
						id="search-query-input"
						type="text"
						className="rounded-md border-1 border-gray-300 w-full p-1 pl-7 font-light"
						placeholder="Search Kaggle datasets"
						value={undebouncedInput}
						onChange={(e) => setUndebouncedInput(e.target.value)}
					></input>
					<i className="bi bi-search absolute top-1/2 -translate-y-1/2 left-2 text-gray-400"></i>
				</div>
				<DropdownMenu
					open={openDropdown}
					onOpenChange={setOpenDropdown}
				>
					<DropdownMenuTrigger asChild>
						<i
							className="bi bi-funnel text-lg hover:scale-110"
							onClick={() => setOpenDropdown(true)}
						></i>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="start"
						side="right"
						sideOffset={20}
					>
						<div className="flex flex-col gap-3 p-3">
							<div className="flex justify-between">
								<div className="flex gap-2 items-center">
									<span className="text-sm font-medium">
										Search By
									</span>
									<Select
										value={searchOption}
										onValueChange={setSearchOption}
									>
										<SelectTrigger className="mt-1">
											<SelectValue placeholder="Select sort option" />
										</SelectTrigger>
										<SelectContent>
											{selectOptions.map(
												(item, index) => (
													<SelectItem
														key={index}
														value={item.value}
													>
														{item.label}
													</SelectItem>
												)
											)}
										</SelectContent>
									</Select>
								</div>
								<div className="flex items-center gap-2 pl-2">
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
									{searchTags.map((item, index) => (
										<button
											className={
												"text-center px-1.5 rounded-xl border-1 text-sm " +
												(item.isSelected
													? "border-black"
													: "border-gray-300 hover:border-black")
											}
											key={index}
											onClick={() =>
												handleSearchTagClick(index)
											}
										>
											{item.label}
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
									value={[minFileSize, maxFileSize]}
									min={0}
									max={50 * 1024 * 1024}
									step={1}
									label={(value) => (
										<span className="text-sm">
											{(
												(value ?? 0) /
												1024 /
												1024
											).toFixed(0)}
											MB
										</span>
									)}
									onValueChange={setFileSizeLimit}
								/>
							</div>
							<div className="flex justify-between">
								<Button
									variant={"outline"}
									size={"sm"}
									className="font-light"
									onClick={(e) => {
										e.preventDefault();
										setOpenDropdown(false);
									}}
								>
									Cancel
								</Button>
								<Button
									size={"sm"}
									className="font-light text-sm"
									onClick={searchDataset}
								>
									Apply
								</Button>
							</div>
						</div>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="flex flex-col gap-2 w-full">
				{searchResult.map((item, index) => (
					<div key={index}>
						<DatasetCard info={item}></DatasetCard>
					</div>
				))}
			</div>
		</div>
	);
}
