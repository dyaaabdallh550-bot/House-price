import numpy as np
import pandas as pd
from typing import Any

def run_inference(model: Any, input_df: pd.DataFrame) -> float:
    """
    Run prediction using the loaded model.
    The model returns a log-transformed price, so we apply np.expm1.
    """
    log_pred = model.predict(input_df)[0]
    predicted_price = float(np.expm1(log_pred))
    return round(predicted_price, 2)
