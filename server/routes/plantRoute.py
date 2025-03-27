from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ml_utility.PlantDiseaseClassifier import PlantDiseaseClassifier
import os

router = APIRouter()

# Initialize the classifier (lazily on first request to save resources)
classifier = None

def get_classifier():
    global classifier
    if classifier is None:
        classifier = PlantDiseaseClassifier()
    return classifier

class PlantImageRequest(BaseModel):
    image_base64: str

class PlantPrediction(BaseModel):
    label: str
    score: float

class PlantPredictionResponse(BaseModel):
    prediction: PlantPrediction
    success: bool

@router.post("/diagnose", response_model=PlantPredictionResponse)
async def diagnose_plant(request: PlantImageRequest):
    """Analyze a plant image and detect diseases - returns only the top prediction"""
    try:
        # Get the classifier instance
        model = get_classifier()
        
        # Make prediction
        results = model.predict_from_base64(request.image_base64)
        
        # Just return the top result (which should be the first one as they're sorted by score)
        top_prediction = results[0]
        
        return {
            "prediction": top_prediction,
            "success": True
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing image: {str(e)}"
        )

@router.get("/test")
async def test_classifier():
    """Simple test endpoint that uses a built-in test image"""
    try:
        # Get the classifier instance
        model = get_classifier()
        
        # Path to a test image in the server directory
        test_image_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "test_images", "test_plant.jpg")
        
        # If the test image doesn't exist, return an error
        if not os.path.exists(test_image_path):
            return {"success": False, "error": "Test image not found"}
        
        # Convert to base64 and predict
        base64_string = PlantDiseaseClassifier.image_to_base64(test_image_path)
        results = model.predict_from_base64(base64_string)
        
        # Just return the top result
        top_prediction = results[0]
        
        return {
            "prediction": top_prediction,
            "success": True
        }
    except Exception as e:
        return {"success": False, "error": str(e)}