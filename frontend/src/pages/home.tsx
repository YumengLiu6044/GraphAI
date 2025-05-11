import { Link } from "react-router-dom";

export default function Home() {
	return (
		<div className="w-full border-t-1 border-b-1 border-gray-300 px-5 md:px-10 lg:px-20 py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 justify-center bg-indigo-50 items-center">
			<div className="flex flex-col gap-10">
				<div className="flex flex-col gap-3">
					<span className="text-6xl font-semibold">
						Build AI Models
					</span>
					<span className="text-6xl font-semibold text-purple-600">
						Without Code
					</span>
				</div>

				<span className="max-w-xl text-gray-500 text-lg">
					Train machine learning models by simply dragging and
					dropping components. Search for datasets using the Kaggle
					API and deploy your models in minutes.
				</span>

				<div className="flex flex-row gap-5">
					<div className="rounded-md px-5 py-3 bg-purple-600 text-white text-sm hover:shadow-md transition-all flex items-center">
						<Link to="/workspace">Get Started</Link><i className="bi bi-arrow-right pl-2"></i>
					</div>
					<div className="rounded-md px-5 py-3 border-1 border-gray-300 text-sm hover:shadow-md transition-all flex items-center">
						<span>Watch Demo</span><i className="bi bi-youtube pl-2"></i>
					</div>
				</div>
			</div>

			<div className="relative w-full h-150 aspect-auto rounded-xl border-1 border-gray-300 bg-gradient-to-t from-black/50 to-transparent">
				<img></img>
				<div className="absolute left-5 bottom-5 flex flex-col gap-2">
					<span className="text-white font-medium ">
						Drag-and-drop ML model builder
					</span>
					<span className="text-gray-300">
						Connect components to build your pipeline
					</span>
				</div>

				<div className="aspect-square absolute -bottom-5 -right-5 rounded-full bg-purple-600 text-white p-2 flex items-center justify-center">
					<span className="text-sm font-medium">No Code</span>
				</div>
			</div>
		</div>
	);
}
