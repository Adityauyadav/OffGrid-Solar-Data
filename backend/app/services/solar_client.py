import httpx
import numpy as np

async def get_solar_per_kw(lat: float, lon: float, year: int = 2022) -> np.ndarray:
    url = (
        f"https://power.larc.nasa.gov/api/temporal/hourly/point?"
        f"latitude={lat}&longitude={lon}&start={year}&end={year}"
        f"&community=RE&parameters=ALLSKY_SFC_SW_DWN&format=JSON&time-standard=UTC"
    )

    async with httpx.AsyncClient(timeout=20) as client:
        resp = await client.get(url)
        resp.raise_for_status()
        data = resp.json()

    ghi = data["properties"]["parameter"]["ALLSKY_SFC_SW_DWN"]
    items = sorted(ghi.items(), key=lambda kv: kv[0])
    arr = np.array([(float(v) / 1000.0) * 0.75 for _, v in items], dtype=float)
    if arr.shape[0] != 8760:
        raise ValueError(f"Expected 8760 hourly points from NASA, got {arr.shape[0]}")
    return arr
