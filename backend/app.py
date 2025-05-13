from pprint import pprint
from kaggle.api.kaggle_api_extended import KaggleApi
from training_job import TrainingJobPytorch
import json
from models import PytorchModelConfig, DataConfig

api = KaggleApi()
api.authenticate()

if __name__ == "__main__":
    with open("sample_jobs/test_job_torch.json") as f:
        json_data = json.load(f)
        model_config = PytorchModelConfig(**json_data["model_config"])
        data_config = DataConfig(**json_data["data_config"])
        job = TrainingJobPytorch(data_config, model_config, "test_job", debug=True)
        job.load_data()
        job.train()
        job.eval()
