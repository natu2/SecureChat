#!/bin/bash

# SecureChat Backend Setup Script
echo "🚀 Setting up SecureChat Backend..."

# Check if uv is installed
if ! command -v uv &> /dev/null; then
    echo "📦 uv not found. Installing uv..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
    
    # Add uv to PATH for current session
    export PATH="$HOME/.cargo/bin:$PATH"
    
    echo "✅ uv installed successfully!"
else
    echo "✅ uv is already installed"
fi

# Create virtual environment and install dependencies
echo "📚 Installing dependencies..."
uv sync

echo "🎉 Setup complete! You can now run the backend with:"
echo "   cd backend"
echo "   uv run python run.py"
echo ""
echo "Or using uvicorn directly:"
echo "   uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000" 