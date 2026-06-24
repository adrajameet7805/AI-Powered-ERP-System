import pandas as pd
from prophet import Prophet

def generate_forecast(historical_data, periods=30):
    """
    historical_data should be a list of dicts: [{'date': '2023-01-01', 'sales': 100}, ...]
    """
    df = pd.DataFrame(historical_data)
    df.rename(columns={'date': 'ds', 'sales': 'y'}, inplace=True)
    
    m = Prophet(daily_seasonality=True)
    m.fit(df)
    
    future = m.make_future_dataframe(periods=periods)
    forecast = m.predict(future)
    
    return forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(periods).to_dict('records')
