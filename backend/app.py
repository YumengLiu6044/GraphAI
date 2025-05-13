from pprint import pprint
from fastapi import FastAPI
from kaggle.api.kaggle_api_extended import KaggleApi
from starlette.middleware.cors import CORSMiddleware
from training_job import TrainingJobPytorch
import json
from models import PytorchModelConfig, DataConfig

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
