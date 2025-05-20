import type { NavigateFunction } from "react-router-dom";

export type SidebarOption = {
	iconName: string;
	action: string;
	shortcut?: string;
	onClick?: (navigate?: NavigateFunction) => void;
};

export type SearchTag = {
	label: string;
	isSelected: boolean;
};

export type DatasetSearchRequest = {
	search_by: string;
	tag_ids: string[];
	search: string;
	min_size: number;
	max_size: number;
	setSearchBy: (searchBy: string) => void;
	setTagIds: (tagIds: string[]) => void;
	setSearch: (search: string) => void;
	setFileSizeLimit: (range: number[]) => void;
};

export type DatasetSearchResponseItem = {
	title: string;
	owner: string;
	last_updated: string;
	featured: boolean;
	votes: number;
	size: number;
};

export type DatasetSearchResponseStore = {
	response: DatasetSearchResponseItem[]
	setResponse: (newResponse: DatasetSearchResponseItem[]) => void
}

export type LoadingStore = {
	isLoading: boolean,
	setIsLoading: (newState: boolean) => void
}