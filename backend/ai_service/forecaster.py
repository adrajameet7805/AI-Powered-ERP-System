import warnings
import logging
import os

warnings.filterwarnings("ignore")
os.environ["CMDSTAN_VERBOSE"] = "false"
logging.getLogger("prophet").setLevel(logging.ERROR)
logging.getLogger("cmdstanpy").setLevel(logging.ERROR)

# Silence plotly import error from prophet
import logging as _log
_log.getLogger("prophet.plot").setLevel(_log.CRITICAL)

import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def get_prophet_forecast(sales_data, days=30):
    try:
        from prophet import Prophet
        
        # Prepare data for Prophet: needs 'ds' (date) and 'y' (value)
        df = pd.DataFrame(sales_data, columns=['ds', 'y'])
        df['ds'] = pd.to_datetime(df['ds'])
        
        # If not enough data points, fallback to simple average
        if len(df) < 5:
            return None
            
        m = Prophet(daily_seasonality=False, yearly_seasonality=False, weekly_seasonality=True)
        m.fit(df)
        
        future = m.make_future_dataframe(periods=days)
        forecast = m.predict(future)
        
        # Get sum of forecasted values for the next 'days'
        future_forecast = forecast.tail(days)
        total_demand = future_forecast['yhat'].sum()
        
        # Ensure non-negative demand
        return max(0, int(total_demand))
    except Exception as e:
        print(f"Prophet forecast failed: {e}")
        return None

def get_sklearn_forecast(sales_data, days=30):
    try:
        from sklearn.linear_model import LinearRegression
        
        df = pd.DataFrame(sales_data, columns=['ds', 'y'])
        df['ds'] = pd.to_datetime(df['ds'])
        df = df.sort_values('ds')
        
        # Convert dates to ordinal for linear regression
        df['ds_ordinal'] = df['ds'].apply(lambda x: x.toordinal())
        
        if len(df) < 3:
            return None
            
        X = df[['ds_ordinal']]
        y = df['y']
        
        model = LinearRegression()
        model.fit(X, y)
        
        # Predict future dates
        last_date = df['ds'].max()
        future_dates = [last_date + timedelta(days=i) for i in range(1, days + 1)]
        future_ordinals = np.array([[d.toordinal()] for d in future_dates])
        
        predictions = model.predict(future_ordinals)
        total_demand = predictions.sum()
        
        return max(0, int(total_demand))
    except Exception as e:
        print(f"Sklearn forecast failed: {e}")
        return None

def analyze_inventory(products, sales_history):
    """
    Analyzes inventory levels and returns AI insights.
    `products`: list of dicts with sku, name, current_stock, reorder_level
    `sales_history`: dict grouping sales by sku. e.g. {'SKU-100': [{'ds': '2023-01-01', 'y': 5}, ...]}
    """
    sku_insights = []
    
    total_items = len(products)
    urgent_count = 0
    overstock_count = 0
    
    for product in products:
        sku = product['sku']
        name = product['name']
        current_stock = product['current_stock']
        reorder_level = product['reorder_level']
        
        history = sales_history.get(sku, [])
        
        # Try Prophet, fallback to Sklearn, fallback to basic average
        forecast30d = get_prophet_forecast(history, 30)
        
        if forecast30d is None:
            forecast30d = get_sklearn_forecast(history, 30)
            
        if forecast30d is None:
            # Fallback naive average
            if history:
                avg_daily = sum([h['y'] for h in history]) / len(history)
                forecast30d = int(avg_daily * 30)
            else:
                forecast30d = 10 # default assumed demand if no history
                
        # Calculate insights
        suggested_order_qty = 0
        recommendation = "healthy"
        reasoning = "Stock levels are optimal for projected demand."
        
        if current_stock <= reorder_level or current_stock < forecast30d:
            suggested_order_qty = max(forecast30d * 2 - current_stock, reorder_level * 2)
            if current_stock == 0:
                recommendation = "reorder_urgent"
                reasoning = f"Stockout detected. Expected 30-day demand is {forecast30d} units."
                urgent_count += 1
            else:
                days_left = int(current_stock / (forecast30d / 30)) if forecast30d > 0 else 999
                if days_left < 7:
                    recommendation = "reorder_urgent"
                    reasoning = f"Critical shortage risk. Stock will deplete in ~{days_left} days."
                    urgent_count += 1
                else:
                    recommendation = "reorder_soon"
                    reasoning = f"Low stock alert. Current levels might not cover the {forecast30d} unit demand."
        elif current_stock > forecast30d * 4 and forecast30d > 0:
            recommendation = "overstock"
            reasoning = f"Significant overstock detected. Current inventory covers >120 days of demand."
            overstock_count += 1
            
        sku_insights.append({
            "sku": sku,
            "name": name,
            "currentStock": current_stock,
            "forecast30d": forecast30d,
            "recommendation": recommendation,
            "reasoning": reasoning,
            "suggestedOrderQty": suggested_order_qty
        })
        
    summary = f"AI Forecasting analyzed {total_items} SKUs. Detected {urgent_count} urgent reorder tasks and {overstock_count} overstock risks based on 30-day Prophet/Linear projections."
    
    return {
        "summary": summary,
        "sku_insights": sku_insights
    }
