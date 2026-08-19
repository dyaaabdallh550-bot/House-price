import pytest
from fastapi.testclient import TestClient
from app.main import app

# Create a dummy model object to mock during tests to avoid needing the real .pkl file
class DummyModel:
    def predict(self, df):
        import numpy as np
        # Return log of price 5,000,000 for dummy prediction
        return [np.log1p(5000000.0)]

# Override the app state model for testing
app.state.model = DummyModel()
client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_predict_happy_path():
    payload = {
        "carpet_area_sqft": 1200,
        "bathroom_num": 2,
        "floor_num": 3,
        "balcony_num": 1,
        "parking_num": 1,
        "location": "bangalore",
        "Furnishing": "semi-furnished",
        "Status": "ready to move",
        "Transaction": "resale",
        "Ownership": "freehold",
        "facing": "east"
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "predicted_price" in data
    # The dummy model returns exactly 5,000,000
    assert round(data["predicted_price"]) == 5000000

def test_predict_invalid_input():
    payload = {
        "carpet_area_sqft": "invalid_string_instead_of_number",
        "bathroom_num": 2,
        "location": "bangalore"
        # Missing other required fields
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 422
