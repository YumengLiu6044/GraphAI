import unittest
from backend.app import app
from backend.models import DatasetFileSearchResponse, DatasetSearchResponseItem
from fastapi.testclient import TestClient

test_client = TestClient(app)

class AppTestCase(unittest.TestCase):
    def test_read_main(self):
        response = test_client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"message": "Hello World"})

    def test_search_dataset(self):
        response = test_client.post("/searchDataset", json={
            "search": "titanic"
        })
        self.assertEqual(response.status_code, 200)
        assert DatasetSearchResponseItem(**response.json()[0])

    def test_search_dataset_files(self):
        response = test_client.get("/searchDatasetFiles/brendan45774/test-file")
        self.assertEqual(response.status_code, 200)
        assert DatasetFileSearchResponse(**response.json())

    def test_search_dataset_columns(self):
        response = test_client.post("/getDatasetColumns", json={
            "ref": "jayaantanaath/student-habits-vs-academic-performance",
            "file_name": "student_habits_performance.csv"
        })
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)

if __name__ == '__main__':
    unittest.main()