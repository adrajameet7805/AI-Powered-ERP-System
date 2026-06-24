#!/bin/bash
echo "Starting SynergyBeam ERP..."
cd backend && source venv/bin/activate && python app.py &
BACKEND_PID=$!
sleep 4
cd ../frontend && npm run dev &
echo "Backend PID: $BACKEND_PID"
echo "Frontend: http://localhost:5173"
wait
