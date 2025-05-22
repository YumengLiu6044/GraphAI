import { create } from "zustand";
import {
	type DatasetSearchResponseStore,
	type DatasetSearchRequest,
	type LoadingStore,
	type NodeStore,
	type FileSearchStore,
	type EdgeStore,
} from "./types";

export const useDatasetSearchRequestStore = create<DatasetSearchRequest>(
	(set) => ({
		search_by: "votes",
		tag_ids: [],
		search: "",
		min_size: 0,
		max_size: 50 * 1024 * 1024,
		setSearchBy: (searchBy) => set(() => ({ search_by: searchBy })),
		setTagIds: (tag_ids) => set(() => ({ tag_ids })),
		setSearch: (search) => set(() => ({ search })),
		setFileSizeLimit: (range) =>
			set(() => ({ min_size: range[0], max_size: range[1] })),
	})
);

export const useDatasetSearchResponseStore = create<DatasetSearchResponseStore>(
	(set) => ({
		response: [],
		selectedIndex: -1,
		setSelectedIndex: (newIndex) =>
			set(() => ({ selectedIndex: newIndex })),
		setResponse: (newResponse) => set(() => ({ response: newResponse })),
	})
);

export const useIsLoadingDatasetSearchStore = create<LoadingStore>((set) => ({
	isLoading: false,
	setIsLoading: (newState) => set(() => ({ isLoading: newState })),
}));

export const useNodeStore = create<NodeStore>((set) => ({
	nodes: [
		{
			id: "dataset-selector",
			type: "datasetSelector",
			position: { x: window.screen.width / 4, y: 100 },
			data: {},
		},
	],
	appendNode: (newNode) =>
		set((state) => {
			if (state.nodes.map((item) => item.id).includes(newNode.id)) {
				console.log("Node exists");
				return { nodes: state.nodes };
			}

			return { nodes: [...state.nodes, newNode] };
		}),
	removeNode: (nodeID) =>
		set((state) => ({ nodes: state.nodes.filter((n) => n.id !== nodeID) })),
}));

export const useEdgeStore = create<EdgeStore>((set) => ({
	edges: [],
	setEdges: (edges) => set({ edges }),
	appendEdge: (newEdge) =>
		set((state) => {
			if (state.edges.map((item) => item.id).includes(newEdge.id)) {
				console.log("edge exists");
				return { nodes: state.edges };
			}

			return { edges: [...state.edges, newEdge] };
		}),
	removeEdge: (edgeID) =>
		set((state) => ({ edges: state.edges.filter((e) => e.id !== edgeID) })),
}));

export const useFileSearchStore = create<FileSearchStore>((set) => ({
	files: [],
	selectedFileIndex: -1,
	isLoading: false,
	setIsLoading: (newState) => set(() => ({ isLoading: newState })),
	setFiles: (newFiles) => set(() => ({ files: newFiles })),
	setSelectedFileIndex: (newIndex) =>
		set(() => ({ selectedFileIndex: newIndex })),
}));
