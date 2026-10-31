import os
import sys

# Ensure backend directory is in the Python path
backend_path = os.path.join(os.path.dirname(__file__), "backend")
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

# Import the FastAPI application
from app.main import app
