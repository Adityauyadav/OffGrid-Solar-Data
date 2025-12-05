import numpy as np


def survives(
    load: np.ndarray, solar: np.ndarray, pv: float, battery: float
) -> bool:
    soc = battery
    net = (solar * pv) - load

    for x in net:
        if x >= 0:
            soc = min(battery, soc + x)
        else:
            soc += x
            if soc < 0:
                return False
    return True


def find_min_battery_for_pv(
    load: np.ndarray, solar: np.ndarray, pv: float
) -> float:
    net = (solar * pv) - load
    if np.sum(net) < 0:
        return None

    low = 0.0
    high = float(np.sum(load))

    while high - low > 1.0:
        mid = (low + high) / 2
        if survives(load, solar, pv, mid):
            high = mid
        else:
            low = mid

    return high
