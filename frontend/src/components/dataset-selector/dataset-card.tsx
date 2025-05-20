import type { DatasetSearchResponseItem } from "@/utils/types";

interface DatasetCardProps {
	info: DatasetSearchResponseItem;
}

function formatDate(timestamp: string): string {
	return new Date(timestamp).toISOString().split("T")[0];
}

export default function DatasetCard({ info }: DatasetCardProps) {
	return (
		<div className="flex flex-col space-y-2 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
			<div className="flex justify-between items-start">
				<div className="flex items-center gap-2">
					<i className="bi bi-file-earmark-text"></i>
					<h3 className="font-medium">{info.title}</h3>
					{info.featured && (
						<span className="px-2 text-sm rounded-xl bg-green-50 text-green-600 border-green-200">
							Featured
						</span>
					)}
				</div>
				<i
					className="bi bi-box-arrow-up-right hover:scale-110"
					onClick={() => window.open(info.url, "_blank")}
				></i>
			</div>
			<div className="flex flex-wrap gap-x-4 text-sm text-muted-foreground">
				<span>Size: {(info.size / 1024 / 1024).toFixed(0)}MB</span>
				<span>By: {info.owner}</span>
				<span>Votes: {info.votes}</span>
				<span>Updated: {formatDate(info.last_updated)}</span>
			</div>
		</div>
	);
}
