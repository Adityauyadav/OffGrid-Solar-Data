import numpy as np
from .parts import find_min_battery_for_pv


def cost_function(pv_cost: float = 1.0, battery_cost: float = 0.5):
    def cost(pair):
        pv, batt = pair
        return pv * pv_cost + batt * battery_cost
    return cost


def engine(
    load: np.ndarray,
    solar: np.ndarray,
    pv_cost: float = 1.0,
    battery_cost: float = 0.5,
):
    avg_load = float(np.mean(load))
    avg_solar = float(np.mean(solar))

    start_pv = avg_load / avg_solar
    end_pv = start_pv * 5.0

    pv_candidates = np.linspace(start_pv, end_pv, 100)

    valid_pairs = []

    for pv in pv_candidates:
        batt = find_min_battery_for_pv(load, solar, pv)
        if batt is None:
            continue
        valid_pairs.append([float(pv), float(batt)])

    if not valid_pairs:
        return {"pv": None, "battery": None, "pairs": []}

    cost = cost_function(pv_cost, battery_cost)
    best_pv, best_batt = min(valid_pairs, key=cost)

    return {
        "pv": round(best_pv, 2),
        "battery": round(best_batt, 2),
        "pairs": valid_pairs,
    }
