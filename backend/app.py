import dotenv
dotenv.load_dotenv()

import uvicorn
from fastapi import FastAPI, HTTPException
from kaggle.api.kaggle_api_extended import KaggleApi
from fastapi.middleware.cors import CORSMiddleware
from kagglesdk.datasets.types.dataset_api_service import ApiGetDatasetMetadataRequest
from backend.models import DatasetSearchRequest, DatasetFileSearchResponse, DatasetSearchResponseItem
from backend.training_job import TrainingJobPytorch
import json

api = KaggleApi()
api.authenticate()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/searchDataset")
async def search_dataset(request: DatasetSearchRequest):
    request_dict = request.model_dump()
    request_dict["tag_ids"] = ",".join(request_dict["tag_ids"])
    request_dict["mine"] = False
    request_dict["file_type"] = "csv"

    dataset_search_response = api.dataset_list(**request_dict)


    if not dataset_search_response:
        raise HTTPException(status_code=404, detail=dataset_search_response.errorMessage)

    app_response = []

    for dataset in dataset_search_response:
        app_response_item = DatasetSearchResponseItem()
        app_response_item.votes = dataset.vote_count
        app_response_item.owner = dataset.creator_name
        app_response_item.title = dataset.title
        app_response_item.featured = dataset.is_featured
        app_response_item.last_updated = dataset.last_updated.strftime("%Y-%m-%d")
        app_response_item.size = dataset.total_bytes
        app_response_item.url = dataset.url
        app_response_item.ref = dataset.ref
        app_response.append(app_response_item)

    return app_response[:5]

@app.get("/searchDatasetFiles/{owner}/{dataset_name}")
async def search_dataset_files(owner: str, dataset_name: str):
    dataset_ref = f"{owner}/{dataset_name}"
    app_response = DatasetFileSearchResponse()

    files_search_response = api.dataset_list_files(dataset_ref)
    if files_search_response.errorMessage:
        raise HTTPException(status_code=404, detail=files_search_response.errorMessage)

    for file in files_search_response.files:
        if file.name.endswith(".csv"):
            file_obj = {
                "fileName": file.name,
                "fileSize": file.total_bytes,
            }
            app_response.files.append(file_obj)

    return app_response

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
