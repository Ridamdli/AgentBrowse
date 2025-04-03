# AgentBrowse

<p align="center">
  <img src="https://via.placeholder.com/150?text=AgentBrowse" alt="AgentBrowse Logo" width="150" height="150">
</p>

<p align="center">
  A powerful web-based AI agent platform that enables users to interact with various AI models and visualize their actions in real-time.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#configuration">Configuration</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

## Features

- **Multi-Model Support**: Seamlessly integrate with OpenAI (GPT-4o), Anthropic (Claude 3.5), Google Gemini, Azure OpenAI, and DeepSeek models
- **Real-time Visualization**: See AI actions displayed visually as they happen
- **Split-Screen Interface**: Chat with AI on the left while viewing actions on the right
- **Advanced Markdown Rendering**: Support for code blocks, tables, and complex formatting
- **Resizable Panels**: Customize your viewing experience with adjustable panels
- **Dark/Light Mode**: Choose your preferred theme for comfortable usage
- **User Dashboard**: Manage API keys and settings in a central location
- **Secure API Key Storage**: Store your API keys securely in Supabase

## Tech Stack

### Frontend
- React with TypeScript
- Vite for fast development
- TailwindCSS for styling
- Framer Motion for animations
- React Markdown for rendering responses
- Syntax highlighting for code blocks

### Backend
- Python 3.11+ with FastAPI
- Uvicorn for ASGI server
- Pydantic for data validation
- Playwright for browser automation
- Supabase for data storage

## Installation

### Prerequisites
- Node.js (v14 or higher)
- Python 3.11 or higher
- npm or yarn

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/AgentBrowse.git
cd AgentBrowse

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Backend Setup
```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment using uv
pip install uv
uv venv --python 3.11
# On Windows
.venv\Scripts\activate
# On macOS/Linux
source .venv/bin/activate

# Install dependencies
uv pip install -r requirements.txt

# Install browser-use package
uv pip install browser-use

# Install Playwright (required for browser automation)
playwright install

# Start the backend server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Environment Configuration
Create a `.env` file in the root directory with the following variables:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Usage

### Getting Started
1. Start both the frontend and backend servers using the commands mentioned in the installation section
2. Access the application at `http://localhost:5173` in your browser
3. Select an AI model from the dropdown menu in the header
4. If you haven't added your API key yet, you'll be prompted to add it in the settings
5. Type your query or task in the chat input and press Enter (or use Ctrl+Enter)
6. Watch as the AI processes your request and visualizes its actions in real-time

### Key Features Usage
- **Resizing panels**: Drag the center divider to adjust the split between chat and visualization
- **Full-screen mode**: Click the maximize button on either panel for a focused view
- **API key management**: Access via the settings icon in the top right corner
- **Theme switching**: Toggle between dark and light mode using the theme icon

## Configuration

### Supported AI Models
AgentBrowse supports the following AI models:

- **OpenAI**
  - GPT-4o
  - GPT-4
  - GPT-3.5 Turbo

- **Anthropic**
  - Claude 3.5 Sonnet
  - Claude 3 Opus
  - Claude 3 Haiku

- **Google**
  - Gemini Pro
  - Gemini Ultra

- **Azure OpenAI**
  - Custom deployments

- **DeepSeek**
  - DeepSeek V3
  - DeepSeek Reasoner

Each model requires its own API key, which can be configured in the user dashboard.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Made with ❤️ by Your Team Name
</p>
