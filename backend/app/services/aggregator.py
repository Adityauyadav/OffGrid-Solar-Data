from .load_parser import parse_load_file
from .solar_client import get_solar_per_kw
from app.engine.engine import engine


async def run_full_simulation(
    file_bytes: bytes,
    filename: str,
    lat: float,
    lon: float,
    pv_cost: float = 1.0,
    battery_cost: float = 0.5,
):
    hourly_series = parse_load_file(file_bytes, filename)
    load = hourly_series.to_numpy(dtype=float)

    solar = await get_solar_per_kw(lat, lon)

    result = engine(load, solar, pv_cost, battery_cost)

    pv_battery_curve = [
        {"pv": float(pv), "battery": float(batt)}
        for pv, batt in result["pairs"]
    ]

    return {
        "pv_kw": result["pv"],
        "battery_kwh": result["battery"],
        "pv_battery_curve": pv_battery_curve,
        "load_profile": load.tolist(),
        "solar_profile": solar.tolist(),
    }
