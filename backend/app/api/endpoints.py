from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.aggregator import run_full_simulation

router = APIRouter()

@router.post("/simulate")
async def simulate(
    file: UploadFile = File(...),
    lat: float = Form(...),
    lon: float = Form(...),
    pv_cost: float = Form(1.0),
    battery_cost: float = Form(0.5),
):
    try:
        file_bytes = await file.read()
        result = await run_full_simulation(
            file_bytes=file_bytes,
            filename=file.filename,
            lat=lat,
            lon=lon,
            pv_cost=pv_cost,
            battery_cost=battery_cost,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))