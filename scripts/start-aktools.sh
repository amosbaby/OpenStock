#!/bin/bash

# Ensure we are in the project root
cd "$(dirname "$0")/.."

# Check for Python 3
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 not found. Please install Python 3.7+."
    exit 1
fi

# Create a virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "⬇️  Installing dependencies from requirements.txt..."
pip install -r requirements.txt

# Start AKTools
echo "🚀 Starting AKTools Server on http://127.0.0.1:8080..."
echo "Press Ctrl+C to stop."
python3 -m aktools --host 127.0.0.1 --port 8088
