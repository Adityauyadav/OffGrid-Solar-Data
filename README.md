# OffGridCalc

OffGridCalc is a precision tool for sizing off-grid solar photovoltaic (PV) arrays and battery storage systems. It uses time-series simulation (8760 hours/year) to analyze user-uploaded load profiles against location-specific solar irradiance data, determining the optimal system configuration that minimizes cost while ensuring reliability.


## Features

- **Scientific Sizing Engine**: Uses "Pinch Point Analysis" and time-series simulation rather than simple rule-of-thumb calculations.
- **Global Solar Data**: Integrates with NASA POWER API to fetch historical solar irradiance for any coordinate on Earth.
- **Load Profile Analysis**: Supports CSV/Excel uploads for hourly load data.
- **Economic Optimization**: Finds the lowest lifecycle cost combination of PV and Battery.
- **Interactive Visualization**: Visualizes seasonal load patterns, solar reliability, and system performance.

## Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Visualization**: Recharts
- **Maps**: Leaflet / React-Leaflet

### Backend
- **Framework**: FastAPI (Python)
- **Core Logic**: NumPy (Vectorized calculations for performance)
- **Data Processing**: Pandas
- **API Client**: HTTPX (Async requests to NASA POWER API)

## Prerequisites

- **Node.js**: v18 or higher
- **Python**: v3.9 or higher
- **Git**

## Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Adityauyadav/OffGrid-Solar-Data.git
cd OffGrid-Solar-Data
```

### 2. Backend Setup
Navigate to the backend directory, create a virtual environment, and install dependencies.

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup
Navigate to the frontend directory and install dependencies.

```bash
cd ../frontend
npm install
```

## Running the Application

You need to run both the backend and frontend servers simultaneously.

### Start the Backend Server
In the `backend` directory (with venv activated):

```bash
uvicorn app.main:app --reload
```
The API will start at `http://127.0.0.1:8000`. You can view the interactive API docs at `http://127.0.0.1:8000/docs`.

### Start the Frontend Development Server
In the `frontend` directory:

```bash
npm run dev
```
The application will be accessible at `http://localhost:5173`.

## Environment Variables

### Frontend
The frontend automatically connects to the local backend at `http://127.0.0.1:8000` or the production URL defined in the code. To force a specific API URL locally, create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://127.0.0.1:8000
```

## Project Structure

```
OffGrid-Solar-Data/
├── backend/
│   ├── app/
│   │   ├── api/          # API Routes
│   │   ├── engine/       # Core sizing algorithms (NumPy)
│   │   ├── services/     # External services (NASA API, File parsing)
│   │   └── main.py       # App entry point
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route pages (Landing, Calculator, Dashboard)
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## License

This project is a personal project by Aditya Yadav.
