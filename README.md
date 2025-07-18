# SecureChat
A secure web-based messaging app that lets two users send and read encrypted messages using modern encryption techniques.

## Project Structure
- `backend/` - FastAPI backend server
- `frontend/` - React frontend application

## Quick Start

### Backend Setup
```bash
cd backend

# On macOS/Linux
chmod +x setup.sh
./setup.sh

# On Windows
setup.bat

# Start the backend server
uv run python run.py
```

The backend will be available at `http://localhost:8000`

### Frontend Setup
```bash
cd frontend/securechat-frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will be available at `http://localhost:3000`

## Development

### Backend
- Built with FastAPI
- Uses uv for dependency management (much faster than Poetry!)
- Auto-reloads on code changes in development mode

### Frontend
- Built with React
- Uses npm for dependency management
- Hot reloads on code changes

## API Endpoints

- `GET /` - Health check
- `POST /send/{message_id}` - Send a message
- `GET /get-messages` - Get all messages

## Contributing

1. Clone the repository
2. Set up both backend and frontend following the instructions above
3. Make your changes
4. Test your changes
5. Submit a pull request
