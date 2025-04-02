# Browser Use Backend

This is the backend service for the Browser Use platform, which enables users to interact with AI models and visualize their actions in real-time.

## Features

- User authentication and API key management
- OpenAI model integration
- WebSocket-based real-time communication
- Supabase integration for database storage
- Secure API key encryption

## Prerequisites

- Docker and Docker Compose
- Supabase account with URL and anon key
- Node.js and npm (for frontend)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

The `ENCRYPTION_KEY` will be automatically generated if not provided.

## Running the Backend

### Using Docker Compose (Recommended)

1. Build and start the containers:
   ```
   docker-compose up --build
   ```

2. The API will be available at `http://localhost:8000`

### Without Docker

1. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Install Playwright:
   ```
   python -m playwright install --with-deps chromium
   ```

3. Run the FastAPI server:
   ```
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

## API Endpoints

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/token` - Login and get access token
- `GET /api/auth/me` - Get current user information
- `POST /api/auth/api-keys` - Update API keys
- `GET /api/auth/api-keys/{provider}` - Check if user has API key for a provider
- `POST /api/agent/execute` - Execute a task with a model
- `WebSocket /api/agent/ws` - Real-time task execution and updates

## WebSocket Usage

1. Connect to the WebSocket endpoint: `ws://localhost:8000/api/agent/ws`
2. Send authentication message:
   ```json
   {"token": "your_jwt_token"}
   ```
3. Send task execution request:
   ```json
   {"model": "gpt-4o", "task": "your task here"}
   ```
4. Receive real-time updates as the task is executed

## License

This project is licensed under the MIT License. 