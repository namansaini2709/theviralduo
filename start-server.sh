#!/bin/bash

# Infinite loop to keep the server alive "forever"
while true; do
  echo "Starting The Viral Duo Dev Server..."
  # Kill any existing processes on port 3000
  lsof -ti:3000 | xargs kill -9 2>/dev/null || true
  
  # Run the dev server
  npm run dev
  
  echo "Server crashed or stopped. Restarting in 3 seconds..."
  sleep 3
done
