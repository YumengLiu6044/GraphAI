import {
	useColumnSearchStore,
	useDatasetSearchRequestStore,
	useDatasetSearchResponseStore,
	useFileSearchStore,
} from "./store";
import type { Column } from "./types";

const END_POINT = "http://0.0.0.0:8000/";

export function searchDataset() {
	const searchRequest = useDatasetSearchRequestStore.getState();
	const {
		setResponse: setSearchResult,
		setSelectedIndex: setSelectedIndex,
		isLoading,
		setIsLoading,
	} = useDatasetSearchResponseStore.getState();
	if (isLoading) return;

	setSelectedIndex(-1);

	const params = {
		search: searchRequest.search,
		sort_by: searchRequest.search_by,
		tag_ids: searchRequest.tag_ids,
		min_size: searchRequest.min_size,
		max_size: searchRequest.max_size,
	};

	setIsLoading(true);

	fetch(END_POINT + "searchDataset", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(params),
	})
		.then((result) => result.json())
		.then((data) => {
			setSearchResult(data);
		})
		.finally(() => {
			setIsLoading(false);
		});
}

export function searchDatasetFiles() {
	const { selectedIndex, response } =
		useDatasetSearchResponseStore.getState();
	const { setFiles, setIsLoading, setSelectedFileIndex, isLoading } =
		useFileSearchStore.getState();
	const ref = response[selectedIndex].ref;
	const url = END_POINT + "searchDatasetFiles/" + ref;
	if (isLoading) return
	setSelectedFileIndex(-1);
	setIsLoading(true);
	fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => response.json())
		.then((data) => {
			setFiles(data.files);
		})
		.finally(() => {
			setIsLoading(false);
		});
}

export function getDatasetColumns() {
	const { files, selectedFileIndex } = useFileSearchStore.getState();
	const { response, selectedIndex: selectedDatasetIndex } =
		useDatasetSearchResponseStore.getState();
	const {setData, isLoading, setIsLoading} = useColumnSearchStore.getState()

	const fileName = files[selectedFileIndex].fileName;
	const ref = response[selectedDatasetIndex].ref;

	const request = {
		"ref": ref,
		file_name: fileName
	}

	if (isLoading) return
	setIsLoading(true)

	const url = `${END_POINT}getDatasetColumns/`;

	fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(request)
	})
		.then((response) => (response.json()))
		.then((data) => {
			console.log(data)
			const columnsData = data.map((item: Column) => ({
				...item,
				isSelected: false
			}))
			setData(columnsData || [])
		})
		.finally(() => setIsLoading(false));
}
