import base64
import io
from PIL import Image
from transformers import pipeline

class PlantDiseaseClassifier:
    def __init__(self, model_name="linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification"):
        """Initialize the model pipeline."""
        self.pipe = pipeline("image-classification", model=model_name)

    def predict_from_base64(self, base64_string):
        """Predicts plant disease from a base64-encoded image."""
        # Decode base64 to an image
        image_bytes = base64.b64decode(base64_string)
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        # Run prediction
        result = self.pipe(image)

        return result

    @staticmethod
    def image_to_base64(image_path):
        """Convert an image file to a base64-encoded string."""
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode("utf-8")