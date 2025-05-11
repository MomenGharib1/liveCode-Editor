# LiveCode Editor

A modern React application that combines a chat interface with a powerful code editor, featuring AI-powered assistance and real-time collaboration capabilities.

## Features

### Editor Panel
- **Multi-format Support**: Edit Markdown, JavaScript, and HTML with syntax highlighting
- **Live Preview**: Preview your content in real-time
- **Code Tools**: Access powerful code editing tools with `@` commands
- **Auto-save**: Automatic content saving with manual save option
- **Dark/Light Theme**: Automatic theme switching based on system preferences

### Chat Panel
- **Smart Input**: Intelligent chat input with tool suggestions
- **Streaming Responses**: Real-time streaming of AI responses
- **Manual Scrolling**: Control over chat panel scrolling
- **Context-Aware**: Maintains context between editor and chat

### AI Integration
- **Code Generation**: Generate code snippets and solutions
- **Code Analysis**: Analyze and explain code
- **Refactoring**: Get suggestions for code improvements
- **Documentation**: Generate documentation for your code

### UI/UX Features
- **Responsive Design**: Works on both desktop and mobile devices
- **Split View**: Adjustable split view for chat and editor
- **Modern Interface**: Clean and intuitive Material-UI based design
- **Loading States**: Visual feedback for AI operations

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Ollama (for local AI capabilities)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/MomenGharib1/liveCode-Editor.git
cd liveCode-Editor
```

2. Install dependencies:
```bash
npm install
```

3. Set up Ollama:
   - Install Ollama from [ollama.ai](https://ollama.ai)
   - Pull the required model:
   ```bash
   ollama pull codellama:7b
   ```
   - Start the Ollama server:
   ```bash
   ollama serve
   ```
   - In a new terminal, run the model:
   ```bash
   ollama run codellama:7b
   ```

4. Start the development server:
```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Deployment

### Local Deployment with Ollama Integration

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run server
```

The application will be available at [http://localhost:3001](http://localhost:3001).

### Deploying to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy to Vercel:
```bash
vercel
```

Note: When deploying to Vercel, you'll need to run the Ollama server locally and ensure it's accessible to your deployed application. The proxy server will handle forwarding requests to your local Ollama instance.

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run server`: Starts the production server with Ollama proxy
- `npm run deploy`: Builds and starts the production server
- `npm run eject`: Ejects from Create React App

## Project Structure

```
src/
├── components/         # React components
│   ├── ChatPanel.js    # Chat interface
│   ├── EditorPanel.js  # Code editor
│   ├── SplitView.js    # Main layout
│   └── ...
├── services/          # API and service functions
├── theme.js          # Material-UI theme configuration
└── App.js           # Root component
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Create React App](https://github.com/facebook/create-react-app)
- [Material-UI](https://mui.com/)
- [CodeMirror](https://codemirror.net/)
- [Ollama](https://ollama.ai)
