# 🏠 Real Estate House Price Predictor

An end-to-end, full-stack Machine Learning application designed to estimate property valuation across major cities in India. Powered by a trained Scikit-learn regression model, a high-performance **FastAPI** backend, and a modern, glassmorphic **React + TypeScript + Vite** frontend.

---

## 🌟 Key Features

### 🤖 Machine Learning & Inference Engine
- **Log-Transformed Target Pipeline**: Utilizes log-transformed target modeling ($y = \ln(\text{price} + 1)$) to stabilize regression variance across widely varying real-estate prices, evaluated with $\exp(y) - 1$ post-processing (`np.expm1`).
- **Persisted Artifacts**: Efficient model persistence using `joblib` (`house_price.pkl`) loaded directly into FastAPI application lifespan state.
- **Dynamic Preprocessing**: Automatic input cleaning, location normalization (mapping unrecognized inputs to `other`), and structured DataFrame construction matching training schemas.

### ⚡ FastAPI Backend (RESTful API)
- **High-Performance Architecture**: Built with Python & FastAPI for asynchronous, low-latency prediction endpoints.
- **Strict Data Validation**: Utilizes **Pydantic v2** schemas (`PredictionRequest`, `PredictionResponse`) to enforce strict type checking and range validation.
- **Lifespan State Management**: Preloads model artifacts and city locations JSON into app state on startup for instant warm-start predictions.
- **CORS & Middleware Support**: Pre-configured cross-origin resource sharing for seamless frontend integration.
- **Automated Health Monitoring**: `/health` endpoint for readiness/liveness checks in containerized environments.

### 🎨 Modern React + TypeScript Frontend
- **Glassmorphism UI Design**: Deep dark aesthetic with vibrant glowing accents, glassmorphic cards, responsive grids, and micro-animations.
- **Indian Currency Formatting**: Automatic price formatting into standard Indian numbering syntax (e.g., **₹ 1.25 Cr** or **₹ 85.00 Lakhs**).
- **Derived Real-Estate Metrics**: Real-time calculation of **Price per sq. ft.** based on carpet area inputs.
- **Custom Interactive Select Components**:
  - **Searchable Autocomplete**: Custom filterable dropdown with keyboard navigation and search filter for 20+ supported locations.
  - **Styled Dropdowns**: Custom selects for Furnishing status, Construction status, Transaction type, Ownership, and Facing direction.
- **Robust Error Handling**: Inline user alerts for network errors or invalid server payloads.

### 🐳 Containerization & Testing
- **Docker Integration**: Production-ready `Dockerfile` for single-command containerized deployment of the backend API.
- **Pytest Unit Test Suite**: Comprehensive integration tests covering happy paths, schema edge-cases, and invalid payload status codes (`422 Unprocessable Entity`).

### 📓 Data Science & Exploration Notebooks
- **Model Training Notebooks**: Modular Jupyter notebooks (`house_price_model.ipynb` & `Bengaluru_House_Prices.ipynb`) documenting dataset cleaning, feature engineering, categorical encoding, and evaluation metrics.
- **Visualization Artifacts**: Exported metrics charts (such as actual vs. predicted price distribution scatter plots).

---

## 🏗️ Project Architecture & Structure

```
.
├── backend/                  # FastAPI Application & Model Assets
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   │       └── prediction.py   # Endpoint handlers (/health, /locations, /predict)
│   │   ├── core/
│   │   │   └── config.py       # Environment configuration & settings
│   │   ├── schemas/
│   │   │   └── prediction.py   # Pydantic request/response validation schemas
│   │   ├── services/
│   │   │   ├── inference.py    # Log-inverse prediction executor
│   │   │   └── preprocessing.py# Data cleaning & Pandas DataFrame builder
│   │   └── main.py             # FastAPI entry point & lifespan manager
│   ├── models/
│   │   └── house_price.pkl     # Persisted trained Machine Learning model
│   ├── tests/
│   │   └── test_prediction.py  # Pytest endpoint test suite
│   ├── Dockerfile              # Backend container recipe
│   └── requirements.txt        # Python backend dependencies
│
├── frontend/                 # React 19 + TypeScript + Vite Single Page Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── CustomSelect.tsx      # Custom styled dropdown menu
│   │   │   └── SearchableSelect.tsx  # Autocomplete searchable city picker
│   │   ├── App.tsx             # Main application layout & state logic
│   │   ├── App.css             # Glassmorphism design tokens & styles
│   │   └── index.css           # Global typography & layout resetting
│   ├── package.json            # Node.js dependencies & scripts
│   └── vite.config.ts          # Vite build config & API proxy routing
│
├── notebooks/                # Model Development & Exploratory Data Analysis
│   ├── data/                   # Raw & preprocessed datasets
│   ├── house_price_model.ipynb # Model training & evaluation pipeline
│   ├── actual_vs_predicted.png # Model accuracy visualization plot
│   └── locations.json          # Master list of encoded city locations
│
└── iti/                      # Supplementary Machine Learning Notebooks
    ├── Bengaluru_House_Prices.ipynb
    └── Churn_Classification.ipynb
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Machine Learning** | Python, Scikit-Learn, Pandas, NumPy, Joblib |
| **Backend API** | FastAPI, Uvicorn, Pydantic v2, Pytest |
| **Frontend UI** | React 19, TypeScript, Vite, Vanilla CSS3 (Custom Glassmorphism) |
| **DevOps & Tools** | Docker, Git, Jupyter Notebooks |

---

## 📋 Property Prediction Features

The ML model processes 11 key real-estate attributes:

| Attribute | Type | Options / Range | Example |
| :--- | :--- | :--- | :--- |
| `carpet_area_sqft` | Numeric | 100 - 20,000 sq. ft. | `1200` |
| `bathroom_num` | Numeric | 1 - 15 | `2` |
| `floor_num` | Numeric | 0 - 120 | `3` |
| `balcony_num` | Numeric | 0 - 10 | `2` |
| `parking_num` | Numeric | 0 - 10 | `1` |
| `location` | Categorical | 20+ major cities (Bangalore, Mumbai, Delhi, Pune, Gurgaon, etc.) | `bangalore` |
| `Furnishing` | Categorical | `semi-furnished`, `unfurnished`, `furnished`, `unknown` | `semi-furnished` |
| `Status` | Categorical | `ready to move`, `under construction`, `unknown` | `ready to move` |
| `Transaction` | Categorical | `resale`, `new property`, `unknown` | `resale` |
| `Ownership` | Categorical | `freehold`, `co-operative society`, `leasehold`, `power of attorney`, `unknown` | `freehold` |
| `facing` | Categorical | `east`, `north`, `west`, `south`, `north - east`, etc. | `east` |

---

## 🔌 API Endpoints Reference

### 1. Health Check
- **`GET /health`**
- **Response**: `200 OK`
```json
{
  "status": "ok"
}
```

### 2. Available Locations
- **`GET /locations`**
- **Response**: `200 OK`
```json
[
  "ahmedabad", "bangalore", "chandigarh", "chennai", "faridabad",
  "greater-noida", "gurgaon", "hyderabad", "jaipur", "kolkata",
  "mohali", "mumbai", "new-delhi", "noida", "other", "pune",
  "surat", "thane", "vadodara", "visakhapatnam", "zirakpur"
]
```

### 3. Predict Property Price
- **`POST /predict`**
- **Request Body**:
```json
{
  "carpet_area_sqft": 1200,
  "bathroom_num": 2,
  "floor_num": 3,
  "balcony_num": 2,
  "parking_num": 1,
  "location": "bangalore",
  "Furnishing": "semi-furnished",
  "Status": "ready to move",
  "Transaction": "resale",
  "Ownership": "freehold",
  "facing": "east"
}
```
- **Response**: `200 OK`
```json
{
  "predicted_price": 6850000.0
}
```

---

## 🚀 Quick Start & Local Development Setup

### Prerequisites
- **Python**: 3.10+ installed
- **Node.js**: v18+ and `npm` installed

---

### 1. Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   - **Windows**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **macOS / Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the FastAPI development server:
   ```bash
   python -m uvicorn app.main:app --reload --port 8000
   ```
   - API Documentation (Swagger UI): [http://localhost:8000/docs](http://localhost:8000/docs)

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   - Open browser at: [http://localhost:5173](http://localhost:5173)

---

### 3. Running Unit Tests

To run the backend test suite:
```bash
cd backend
pytest
```

---

### 4. Running with Docker

To build and run the backend container:

```bash
cd backend
docker build -t house-price-backend .
docker run -d -p 8000:8000 --name house-price-api house-price-backend
```

---

## 📝 License

This project is open-source and available under the **MIT License**.
