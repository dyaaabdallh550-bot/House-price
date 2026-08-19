from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import joblib
import logging

from app.core.config import settings
from app.api.routes import prediction
from app.services.preprocessing import load_locations

# Configure basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load model on startup
    logger.info(f"Loading model from {settings.MODEL_PATH}")
    model = joblib.load(settings.MODEL_PATH)
    app.state.model = model
    logger.info("Model loaded successfully")

    # Load locations list
    logger.info(f"Loading locations from {settings.LOCATIONS_PATH}")
    app.state.locations = load_locations(settings.LOCATIONS_PATH)
    logger.info(f"Loaded {len(app.state.locations)} locations")

    yield

    # Clean up on shutdown
    app.state.model = None
    app.state.locations = []

app = FastAPI(
    title="House Price Prediction API",
    description="Predict Indian real-estate house prices using a trained ML model.",
    version="1.0.0",
    lifespan=lifespan,
)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(prediction.router)
