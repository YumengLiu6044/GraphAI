from .training_job import TrainingJob
from sklearn.metrics import classification_report, mean_squared_error
from importlib import import_module

class TrainingJobSklearn(TrainingJob):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def train(self):
        self._get_model_class()
        self._model.fit(self._train_x, self._train_y)

    def eval(self):
        predictions = self._model.predict(self._test_x)
        if self._model_config.learning_type == "classification":
            print(classification_report(self._test_y, predictions))
        else:
            print(mean_squared_error(self._test_y, predictions))

    def _get_model_class(self):
        """Dynamically imports and returns the model class."""
        try:
            module = import_module(self._model_config.module_name)
            model_class = getattr(module, self._model_config.model_name)
            self._model = model_class(**self._model_config.model_params)
            if self._debug:
                print(f"Loaded model class: {model_class}")

        except ImportError as e:
            print(f"Error importing model class: {e}")