import json
import os
import pandas as pd
from app.schemas.prediction import PredictionRequest

VALID_LOCATIONS = [
    "ahmedabad", "bangalore", "chandigarh", "chennai", "faridabad",
    "greater-noida", "gurgaon", "hyderabad", "jaipur", "kolkata",
    "mohali", "mumbai", "new-delhi", "noida", "other",
    "pune", "surat", "thane", "vadodara", "visakhapatnam", "zirakpur"
]

def load_locations(locations_path: str) -> list:
    """Load location list from JSON file, with fallback to VALID_LOCATIONS."""
    try:
        if os.path.exists(locations_path):
            with open(locations_path, "r", encoding="utf-8") as f:
                return json.load(f)
    except Exception:
        pass
    return VALID_LOCATIONS

def preprocess_request(request: PredictionRequest) -> pd.DataFrame:
    data = request.model_dump()

    # Map unknown locations to 'other'
    location = data.get("location", "").lower()
    if location not in VALID_LOCATIONS:
        data["location"] = "other"
    else:
        data["location"] = location

    # The dataframe must have exactly the column names used in training
    df = pd.DataFrame([data])
    return df
