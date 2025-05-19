import unittest
from ..training_job import TrainingJobPytorch, TrainingJobSklearn
import json
from ..models import PytorchModelConfig, ScikitModelConfig, DataConfig, Layer
import os
os.chdir("backend/tests")

class JobsTestCase(unittest.TestCase):
    @staticmethod
    def execute_job(file_path):
        with open(file_path, "r") as f:
            json_data = json.load(f)
            data_config = DataConfig(**json_data["data_config"])
            if json_data["library"] == "torch":
                model_config = PytorchModelConfig(**json_data["model_config"])
                model_config.layers = [Layer(**layer) for layer in model_config.layers]
                job = TrainingJobPytorch(data_config, model_config, "test_job", debug=True)
            else:
                model_config = ScikitModelConfig(**json_data["model_config"])
                job = TrainingJobSklearn(data_config, model_config, "test_job")

            job.load_data()
            job.train()
            job.eval()

    def test_job_torch(self):
        self.execute_job("sample_jobs/test_job_torch.json")

    def test_job_sklearn(self):
        self.execute_job("sample_jobs/test_job_sklearn.json")

    def test_job_resnet(self):
        self.execute_job("sample_jobs/test_job_torch_resnet.json")


if __name__ == '__main__':
    unittest.main()
