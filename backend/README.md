# SecureChat Backend

FastAPI backend for the SecureChat application.

## Quick Start

### Prerequisites
- Python 3.8.1 or higher
- Git

### Setup

#### Option 1: Automatic Setup (Recommended)
```bash
# On macOS/Linux
chmod +x setup.sh
./setup.sh

# On Windows
setup.bat
```

#### Option 2: Manual Setup
```bash
# Install uv (if not already installed)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Install dependencies
uv sync
```

### Running the Backend

#### Development Mode (with auto-reload)
```bash
uv run python run.py
```

#### Alternative: Direct uvicorn command
```bash
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The server will start at `http://localhost:8000`

## API Endpoints

- `GET /` - Health check
- `POST /send` - Send a message
- `GET /get-receivers` - Get receivers for a sender
- `GET /get-messages` - Get all messages between sender and receiver
- `PUT /login` - User login
- `POST /signup` - User signup

## Development

### Adding Dependencies
```bash
uv add package-name
```

### Adding Dev Dependencies
```bash
uv add --dev package-name
```

### Running Tests
```bash
uv run pytest
```

### Code Formatting
```bash
uv run black .
```

### Linting
```bash
uv run flake8
```

## Project Structure

```
backend/
├── main.py                # FastAPI application (API endpoints only)
├── cryptography/
│   ├── symmetric_crypto.py   # Symmetric encryption logic
│   └── message_models.py     # Pydantic models for messages and users
├── run.py                 # Application runner script
├── pyproject.toml         # uv configuration
├── setup.sh               # Unix setup script
├── setup.bat              # Windows setup script
└── README.md
```