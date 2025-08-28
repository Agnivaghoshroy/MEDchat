# SkinAI - Medical Chatbot UI

A modern, responsive chatbot interface for skin cancer detection using the Med Gemma LLM model. This application provides an intuitive interface for users to interact with an AI assistant specialized in dermatological analysis.

## Features

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Glass Morphism**: Modern design with backdrop blur effects
- **Smooth Animations**: Engaging micro-interactions throughout the interface
- **Dark/Light Theme**: Adaptive color scheme for better user experience

### 🔐 Authentication System
- **User Registration**: Create new accounts with email and password
- **Secure Login**: Persistent authentication with local storage
- **Profile Management**: User profile display with avatar and logout functionality
- **Session Management**: Automatic session restoration on page reload

### 💬 Chat Interface
- **Real-time Messaging**: Instant message display with typing indicators
- **Message History**: Persistent chat history with timestamps
- **Multiple Chat Sessions**: Create and manage multiple conversation threads
- **Auto-scroll**: Automatic scrolling to latest messages

### 📱 Dashboard Features
- **Sidebar Navigation**: Collapsible sidebar with chat history
- **New Chat**: Start fresh conversations with one click
- **Chat History**: Browse and resume previous conversations
- **Search Functionality**: Find specific conversations quickly

### 🖼️ Media Support
- **Image Upload**: Drag-and-drop or click-to-upload image functionality
- **Image Analysis**: AI-powered skin condition analysis from uploaded images
- **File Validation**: Automatic file type and size validation
- **Image Preview**: Inline image display in chat messages

### 🎤 Voice Features
- **Voice Recording**: Record voice messages using device microphone
- **Speech-to-Text**: Convert voice recordings to text automatically
- **Audio Playback**: Play back recorded voice messages
- **Microphone Access**: Secure microphone permission handling

### 🤖 AI Integration
- **Med Gemma LLM**: Integration ready for Med Gemma language model
- **Contextual Responses**: AI responses based on conversation context
- **Medical Disclaimers**: Appropriate medical disclaimers for AI advice
- **Specialized Knowledge**: Focused on dermatological and skin health topics

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Grid, Flexbox, CSS Variables
- **Icons**: Font Awesome 6.0
- **Fonts**: Inter (Google Fonts)
- **Storage**: LocalStorage for user data and chat history
- **Media**: Web Audio API for voice recording
- **Responsive**: Mobile-first design approach

## File Structure

```
UI for chatbot/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and animations
├── script.js           # JavaScript functionality
└── README.md           # Project documentation
```

## Installation & Setup

1. **Clone or Download** the project files to your local machine
2. **Open** `index.html` in a modern web browser
3. **Start** using the chatbot interface immediately

### For Development Server (Optional)

If you want to run a local development server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have live-server installed)
npx live-server

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000` in your browser.

## Usage Guide

### Getting Started
1. **Open** the application in your web browser
2. **Sign up** for a new account or sign in with existing credentials
3. **Start** a new chat conversation
4. **Begin** interacting with the SkinAI assistant

### Uploading Images
1. Click the **paperclip icon** (📎) in the input area
2. **Select** an image file from your device
3. **Wait** for the AI to analyze the image
4. **Review** the analysis and recommendations

### Voice Input
1. Click the **microphone icon** (🎤) to start recording
2. **Speak** your message clearly
3. Click the **stop button** to end recording
4. **Review** the transcribed text before sending

### Managing Chats
- **New Chat**: Click "New Chat" to start a fresh conversation
- **Chat History**: Click on any previous chat to resume
- **Auto-save**: All conversations are automatically saved locally

## Features in Detail

### Authentication System
The authentication system provides secure user management with:
- Email/password based registration and login
- Client-side session management
- Persistent user state across browser sessions
- Secure logout functionality

### Chat Management
Advanced chat management includes:
- Multiple concurrent chat sessions
- Automatic message timestamping
- Chat history persistence
- Smart chat titling based on first message

### AI Integration Ready
The application is designed to integrate with the Med Gemma LLM:
- Structured message format for API integration
- Context-aware conversation management
- Medical disclaimer handling
- Specialized prompting for dermatological queries

### Responsive Design
Mobile-optimized interface with:
- Touch-friendly interface elements
- Adaptive layout for different screen sizes
- Optimized typography and spacing
- Cross-browser compatibility

## Browser Support

- **Chrome**: 70+
- **Firefox**: 65+
- **Safari**: 12+
- **Edge**: 79+

## Security Considerations

- Local storage for user data (client-side only)
- Input validation for file uploads
- XSS protection through proper content sanitization
- Secure handling of user media permissions

## Customization

### Styling
Modify `styles.css` to customize:
- Color scheme and branding
- Typography and spacing
- Animation timing and effects
- Layout and component sizing

### Functionality
Extend `script.js` to add:
- Additional file type support
- Enhanced AI integration
- Real-time collaboration features
- Advanced chat management

### AI Integration
To connect with actual Med Gemma LLM:
1. Replace the `generateAIResponse()` function
2. Add API endpoint configuration
3. Implement proper error handling
4. Add authentication for AI service

## Contributing

This is a frontend-only implementation. To contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across different browsers
5. Submit a pull request

## License

This project is open source. Please refer to the license file for usage terms.

## Medical Disclaimer

⚠️ **Important**: This application is for educational and informational purposes only. The AI assistant does not provide medical diagnosis or treatment recommendations. Always consult with qualified healthcare professionals for medical advice, diagnosis, and treatment of any health condition.

## Support

For technical support or questions about the implementation, please refer to the documentation or create an issue in the project repository.

---

**SkinAI** - Advancing dermatological care through AI-powered assistance.
