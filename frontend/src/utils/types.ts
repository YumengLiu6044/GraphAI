import type { Edge, Node } from "@xyflow/react";
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
	ref: string;
	url: string;
};

export type DatasetSearchResponseStore = {
	response: DatasetSearchResponseItem[];
	selectedIndex: number;
	isLoading: boolean;
	setIsLoading: (newState: boolean) => void;
	setSelectedIndex: (newIndex: number) => void;
	setResponse: (newResponse: DatasetSearchResponseItem[]) => void;
};

export type NodeStore = {
	nodes: Node[];
	appendNode: (newNode: Node) => void;
	removeNode: (nodeID: string) => void;
};

export type EdgeStore = {
	edges: Edge[];
	appendEdge: (newEdge: Edge) => void;
	setEdges: (newEdges: Edge[]) => void;
	removeEdge: (edgeID: string) => void;
};

type DatasetFile = {
	fileName: string;
	fileSize: number;
};

export type FileSearchStore = {
	files: DatasetFile[];
	selectedFileIndex: number;
	isLoading: boolean;
	setIsLoading: (newState: boolean) => void;
	setFiles: (newFiles: DatasetFile[]) => void;
	setSelectedFileIndex: (newIndex: number) => void;
};

type Column = {
	key: any[]
}

export type ColumnSearchStore = {
	data: Column[]
	isLoading: boolean
	setData: (newData: Column[]) => void
	setIsLoading: (newState: boolean) => void;
}