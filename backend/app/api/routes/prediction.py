from fastapi import APIRouter, Request
from typing import List
from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.services.preprocessing import preprocess_request
from app.services.inference import run_inference

router = APIRouter()

@router.get("/health")
def health_check():
    return {"status": "ok"}

@router.get("/locations", response_model=List[str])
def get_locations(request: Request):
    """Return the list of valid city/location options for the prediction form."""
    return request.app.state.locations

@router.post("/predict", response_model=PredictionResponse)
def predict_price(request_data: PredictionRequest, request: Request):
    # The model is stored in request.state (set in lifespan)
    model = request.app.state.model

    # Preprocess request into DataFrame
    input_df = preprocess_request(request_data)

    # Run inference
    predicted_price = run_inference(model, input_df)

    return PredictionResponse(predicted_price=predicted_price)
