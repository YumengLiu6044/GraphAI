import unittest
import requests

from backend.models import DatasetFileSearchResponse, DatasetSearchResponseItem

BASE_URL = "http://0.0.0.0:8000"

class AppTestCase(unittest.TestCase):
    def test_read_main(self):
        response = requests.get(BASE_URL)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"message": "Hello World"})

    def test_search_dataset(self):
        response = requests.post(BASE_URL + "/searchDataset", json={
            "search": "titanic"
        })
        self.assertEqual(response.status_code, 200)
        assert DatasetSearchResponseItem(**response.json()[0])

    def test_search_dataset_files(self):
        response = requests.get(BASE_URL + "/searchDatasetFiles/brendan45774/test-file")
        self.assertEqual(response.status_code, 200)
        assert DatasetFileSearchResponse(**response.json())


if __name__ == '__main__':
    unittest.main()