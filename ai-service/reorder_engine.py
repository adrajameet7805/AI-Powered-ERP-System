def suggest_reorder(current_stock, lead_time_days, predicted_daily_sales):
    """
    Suggests whether to reorder and how much.
    """
    safety_stock = predicted_daily_sales * 7  # 1 week safety stock
    reorder_point = (predicted_daily_sales * lead_time_days) + safety_stock
    
    if current_stock <= reorder_point:
        # Economic Order Quantity (EOQ) simplified
        reorder_quantity = max(50, int(predicted_daily_sales * 30)) # order 1 month supply
        return {
            "status": "REORDER",
            "quantity": reorder_quantity,
            "reason": f"Stock ({current_stock}) below reorder point ({reorder_point})"
        }
    return {"status": "SUFFICIENT_STOCK", "quantity": 0}
