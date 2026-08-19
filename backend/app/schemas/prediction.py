from pydantic import BaseModel

class PredictionRequest(BaseModel):
    carpet_area_sqft: float
    bathroom_num: float
    floor_num: float
    balcony_num: float
    parking_num: float
    location: str
    Furnishing: str
    Status: str
    Transaction: str
    Ownership: str
    facing: str

class PredictionResponse(BaseModel):
    predicted_price: float
