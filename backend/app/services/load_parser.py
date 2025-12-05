import pandas as pd
import io

TARGET_HOURS = 8760

def parse_load_file(file_bytes: bytes, filename: str) -> pd.Series:
    name = filename.lower()

    if name.endswith(".csv"):
        df = pd.read_csv(io.BytesIO(file_bytes), header=None)
    elif name.endswith((".xls", ".xlsx")):
        df = pd.read_excel(io.BytesIO(file_bytes), header=None)
    else:
        raise ValueError("Only CSV or Excel supported")

    if df.shape[1] < 2:
        raise ValueError("File must have at least 2 columns: timestamp and load")

    df[0] = pd.to_datetime(df[0], errors="coerce")
    df = df.dropna(subset=[0])
    df = df.set_index(0).sort_index()

    df[1] = pd.to_numeric(df[1], errors="coerce").fillna(0)

    hourly = df[1].resample("1h").mean().fillna(0)

    if len(hourly) < 2:
        raise ValueError("Not enough valid data")

    if len(hourly) > TARGET_HOURS:
        hourly = hourly.iloc[:TARGET_HOURS]
    elif len(hourly) < TARGET_HOURS:
        reps = (TARGET_HOURS // len(hourly)) + 1
        hourly = pd.concat([hourly] * reps).iloc[:TARGET_HOURS]

    hourly.index = pd.date_range(
        start="2023-01-01 00:00:00",
        periods=TARGET_HOURS,
        freq="1h"
    )

    return hourly
