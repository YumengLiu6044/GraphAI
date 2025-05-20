export default function Upload() {
	return (
		<button className="w-full flex flex-col justify-center items-center p-4 py-10 border-1 border-dashed rounded-md border-gray-300 hover:border-gray-500">
			<i className="bi bi-upload text-xl"></i>
			<span>Drag and drop your CSV file</span>
			<span className="text-sm text-gray-500">
				or click to browse your files
			</span>
			<span className="text-sm text-gray-500 pt-3">
				Maximum file size: 10MB
			</span>
		</button>
	);
}