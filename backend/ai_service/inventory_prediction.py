from sklearn.linear_model import LinearRegression
import numpy as np

def predict_inventory_depletion(current_stock, daily_sales_history):
    """
    Predicts how many days until stockout.
    """
    if len(daily_sales_history) < 2:
        return current_stock / max(1, sum(daily_sales_history))
    
    X = np.array(range(len(daily_sales_history))).reshape(-1, 1)
    y = np.array(daily_sales_history)
    
    model = LinearRegression()
    model.fit(X, y)
    
    next_day = len(daily_sales_history)
    predicted_daily_sales = max(1, model.predict([[next_day]])[0])
    
    days_to_stockout = current_stock / predicted_daily_sales
    return days_to_stockout
