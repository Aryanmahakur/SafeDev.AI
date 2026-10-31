
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict

from Backend.predictor import predict_traffic, get_model_info

from Backend.system_manager import (
    get_all_systems,
    get_system,
    update_system
)

from Backend.simulation import (
    start_simulation,
    advance_system
)


app = FastAPI(
    title="SAFEDEV.AI Prediction API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


class PredictionRequest(BaseModel):
    system_id: str
    features: Dict[str, float]


class SystemUpdateRequest(BaseModel):
    features: Dict[str, float]


@app.get("/")
def home():
    return {
        "message": "SAFEDEV.AI Prediction API is running",
        "status": "online"
    }


@app.get("/health")
def health():
    return {
        "status": "online",
        "model_loaded": True
    }


@app.get("/model-info")
def model_information():
    return get_model_info()


@app.post("/predict")
def predict(request: PredictionRequest):
    try:
        result = predict_traffic(request.features)

        return {
            "system_id": request.system_id,
            **result
        }

    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error))


@app.post("/simulation/start")
def simulation_start():
    try:
        systems = start_simulation()

        return {
            "message": "Simulation initialized",
            "total_systems": len(systems),
            "systems": systems
        }

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@app.get("/simulation/systems")
def simulation_systems():
    systems = get_all_systems()

    if not systems:
        raise HTTPException(
            status_code=409,
            detail="Simulation has not been started."
        )

    return {
        "total_systems": len(systems),
        "systems": systems
    }


@app.get("/simulation/systems/{system_id}")
def simulation_system_detail(system_id: str):
    system = get_system(system_id)

    if system is None:
        raise HTTPException(status_code=404, detail="System not found.")

    return system


@app.post("/simulation/systems/{system_id}/update")
def simulation_system_update(
    system_id: str,
    request: SystemUpdateRequest
):
    try:
        result = update_system(
            system_id,
            request.features,
            actual_label=None
        )

        return result

    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error))


@app.post("/simulation/systems/{system_id}/advance")
def simulation_system_advance(system_id: str):

    system = get_system(system_id)

    if system is None:
        raise HTTPException(status_code=404, detail="System not found.")

    label = system["actual_label"]

    if label is None:
        raise HTTPException(
            status_code=400,
            detail="Manual input has no dataset class to advance."
        )

    try:
        return advance_system(system_id, label)

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))
