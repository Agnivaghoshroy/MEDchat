// Application State
let currentUser = null;
let isAuthenticated = false;
let currentChatId = null;
let chatHistory = [];
let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];
let isSidebarCollapsed = false;

// DOM Elements
const elements = {
    authModal: document.getElementById('authModal'),
    authToggle: document.getElementById('authToggle'),
    authForm: document.getElementById('authForm'),
    authTitle: document.getElementById('authTitle'),
    authSubtitle: document.getElementById('authSubtitle'),
    authSubmitBtn: document.getElementById('authSubmitBtn'),
    authSwitchText: document.getElementById('authSwitchText'),
    authSwitchLink: document.getElementById('authSwitchLink'),
    nameField: document.getElementById('nameField'),
    userProfile: document.getElementById('userProfile'),
    userName: document.getElementById('userName'),
    userEmail: document.getElementById('userEmail'),
    logoutBtn: document.getElementById('logoutBtn'),
    newChatBtn: document.getElementById('newChatBtn'),
    chatList: document.getElementById('chatList'),
    chatMessages: document.getElementById('chatMessages'),
    messageInput: document.getElementById('messageInput'),
    sendBtn: document.getElementById('sendBtn'),
    attachBtn: document.getElementById('attachBtn'),
    voiceBtn: document.getElementById('voiceBtn'),
    fileInput: document.getElementById('fileInput'),
    typingIndicator: document.getElementById('typingIndicator'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    closeModal: document.querySelector('.close'),
    sidebarToggle: document.getElementById('sidebarToggle'),
    sidebar: document.querySelector('.sidebar'),
    mainContent: document.querySelector('.main-content'),
    sidebarOverlay: document.getElementById('sidebarOverlay')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadChatHistory();
});

function initializeApp() {
    // Check for stored authentication
    const storedUser = localStorage.getItem('skinai_user');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        isAuthenticated = true;
        updateAuthenticationState();
    }
    
    // Check for stored sidebar state
    const storedSidebarState = localStorage.getItem('skinai_sidebar_collapsed');
    if (storedSidebarState === 'true') {
        isSidebarCollapsed = true;
        toggleSidebar(false);
    }
    
    // Auto-resize textarea
    autoResizeTextarea();
}

function setupEventListeners() {
    // Authentication
    elements.authToggle.addEventListener('click', () => {
        if (isAuthenticated) {
            logout();
        } else {
            openAuthModal();
        }
    });
    
    elements.closeModal.addEventListener('click', closeAuthModal);
    elements.authSwitchLink.addEventListener('click', toggleAuthMode);
    elements.authForm.addEventListener('submit', handleAuth);
    elements.logoutBtn.addEventListener('click', logout);
    
    // Chat functionality
    elements.newChatBtn.addEventListener('click', startNewChat);
    elements.sendBtn.addEventListener('click', sendMessage);
    elements.messageInput.addEventListener('keypress', handleKeyPress);
    elements.messageInput.addEventListener('input', autoResizeTextarea);
    
    // Sidebar toggle
    elements.sidebarToggle.addEventListener('click', () => toggleSidebar());
    
    // File and voice input
    elements.attachBtn.addEventListener('click', () => elements.fileInput.click());
    elements.fileInput.addEventListener('change', handleFileUpload);
    elements.voiceBtn.addEventListener('click', toggleVoiceRecording);
    
    // Modal close on outside click
    elements.authModal.addEventListener('click', (e) => {
        if (e.target === elements.authModal) {
            closeAuthModal();
        }
    });
    
    // Handle window resize for responsive sidebar
    window.addEventListener('resize', handleWindowResize);
    
    // Handle escape key for mobile sidebar
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && window.innerWidth <= 768 && !isSidebarCollapsed) {
            toggleSidebar();
        }
    });
    
    // Close mobile sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            !isSidebarCollapsed && 
            !elements.sidebar.contains(e.target) && 
            !elements.sidebarToggle.contains(e.target)) {
            toggleSidebar();
        }
    });
    
    // Handle overlay click
    elements.sidebarOverlay.addEventListener('click', () => {
        if (window.innerWidth <= 768 && !isSidebarCollapsed) {
            toggleSidebar();
        }
    });
}

// Authentication Functions
function openAuthModal() {
    elements.authModal.style.display = 'block';
    resetAuthForm();
}

function closeAuthModal() {
    elements.authModal.style.display = 'none';
}

function toggleAuthMode() {
    const isSignUp = elements.authTitle.textContent === 'Sign In';
    
    if (isSignUp) {
        elements.authTitle.textContent = 'Sign Up';
        elements.authSubtitle.textContent = 'Join SkinAI today';
        elements.authSubmitBtn.textContent = 'Sign Up';
        elements.authSwitchText.innerHTML = 'Already have an account? <span id="authSwitchLink">Sign in</span>';
        elements.nameField.style.display = 'block';
        elements.nameField.querySelector('input').required = true;
    } else {
        elements.authTitle.textContent = 'Sign In';
        elements.authSubtitle.textContent = 'Welcome back to SkinAI';
        elements.authSubmitBtn.textContent = 'Sign In';
        elements.authSwitchText.innerHTML = 'Don\'t have an account? <span id="authSwitchLink">Sign up</span>';
        elements.nameField.style.display = 'none';
        elements.nameField.querySelector('input').required = false;
    }
    
    // Reattach event listener to new element
    document.getElementById('authSwitchLink').addEventListener('click', toggleAuthMode);
}

function resetAuthForm() {
    elements.authForm.reset();
    elements.authTitle.textContent = 'Sign In';
    elements.authSubtitle.textContent = 'Welcome back to SkinAI';
    elements.authSubmitBtn.textContent = 'Sign In';
    elements.authSwitchText.innerHTML = 'Don\'t have an account? <span id="authSwitchLink">Sign up</span>';
    elements.nameField.style.display = 'none';
    elements.nameField.querySelector('input').required = false;
    
    // Reattach event listener
    document.getElementById('authSwitchLink').addEventListener('click', toggleAuthMode);
}

function handleAuth(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const fullName = document.getElementById('fullName').value;
    const isSignUp = elements.authTitle.textContent === 'Sign Up';
    
    // Simulate authentication (replace with actual API calls)
    showLoading();
    
    setTimeout(() => {
        if (isSignUp) {
            // Sign up logic
            currentUser = {
                id: Date.now(),
                name: fullName,
                email: email,
                avatar: fullName.charAt(0).toUpperCase()
            };
            
            localStorage.setItem('skinai_user', JSON.stringify(currentUser));
            isAuthenticated = true;
            
            showNotification('Account created successfully!', 'success');
        } else {
            // Sign in logic
            currentUser = {
                id: Date.now(),
                name: email.split('@')[0],
                email: email,
                avatar: email.charAt(0).toUpperCase()
            };
            
            localStorage.setItem('skinai_user', JSON.stringify(currentUser));
            isAuthenticated = true;
            
            showNotification('Welcome back!', 'success');
        }
        
        updateAuthenticationState();
        closeAuthModal();
        hideLoading();
    }, 1500);
}

function logout() {
    currentUser = null;
    isAuthenticated = false;
    localStorage.removeItem('skinai_user');
    localStorage.removeItem('skinai_chats');
    updateAuthenticationState();
    chatHistory = [];
    updateChatList();
    startNewChat();
    showNotification('Logged out successfully', 'info');
}

function updateAuthenticationState() {
    if (isAuthenticated && currentUser) {
        elements.authToggle.innerHTML = '<i class="fas fa-user"></i> ' + currentUser.name;
        elements.userProfile.style.display = 'flex';
        elements.userName.textContent = currentUser.name;
        elements.userEmail.textContent = currentUser.email;
        elements.userProfile.querySelector('.user-avatar').textContent = currentUser.avatar;
    } else {
        elements.authToggle.innerHTML = '<i class="fas fa-user"></i> Sign In';
        elements.userProfile.style.display = 'none';
    }
}

// Chat Functions
function toggleSidebar(animate = true) {
    isSidebarCollapsed = !isSidebarCollapsed;
    
    if (isSidebarCollapsed) {
        elements.sidebar.classList.add('collapsed');
        elements.sidebarToggle.classList.add('active');
        elements.sidebarToggle.innerHTML = '<i class="fas fa-times"></i>';
        
        // Check if mobile
        if (window.innerWidth <= 768) {
            elements.sidebar.classList.remove('mobile-open');
            elements.sidebarOverlay.classList.remove('active');
        }
    } else {
        elements.sidebar.classList.remove('collapsed');
        elements.sidebarToggle.classList.remove('active');
        elements.sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
        
        // Check if mobile
        if (window.innerWidth <= 768) {
            elements.sidebar.classList.add('mobile-open');
            elements.sidebarOverlay.classList.add('active');
        }
    }
    
    // Store sidebar state
    localStorage.setItem('skinai_sidebar_collapsed', isSidebarCollapsed.toString());
}

function startNewChat() {
    currentChatId = Date.now().toString();
    elements.chatMessages.innerHTML = `
        <div class="welcome-message">
            <div class="welcome-icon">
                <i class="fas fa-robot"></i>
            </div>
            <h3>Welcome to SkinAI</h3>
            <p>I'm your AI assistant for skin health analysis. You can:</p>
            <ul>
                <li>Upload images of skin conditions for analysis</li>
                <li>Ask questions about skin health</li>
                <li>Get personalized recommendations</li>
                <li>Record voice messages for easier interaction</li>
            </ul>
            <p class="disclaimer">⚠️ This AI assistant is for informational purposes only and should not replace professional medical advice.</p>
        </div>
    `;
    
    // Add to chat history
    const newChat = {
        id: currentChatId,
        title: 'New Conversation',
        timestamp: new Date(),
        messages: [],
        isPinned: false
    };
    
    chatHistory.unshift(newChat);
    updateChatList();
    saveChatHistory();
}

function sendMessage() {
    const message = elements.messageInput.value.trim();
    if (!message) return;
    
    // Add user message
    addMessage('user', message);
    elements.messageInput.value = '';
    autoResizeTextarea();
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate AI response
    setTimeout(() => {
        hideTypingIndicator();
        generateAIResponse(message);
    }, 1500);
    
    // Update chat title if it's the first message
    updateChatTitle(message);
}

function addMessage(sender, content, type = 'text', imageUrl = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    let imageHtml = '';
    if (imageUrl && type === 'image') {
        imageHtml = `<img src="${imageUrl}" alt="Uploaded image" class="message-image">`;
    }
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-${sender === 'user' ? 'user' : 'robot'}"></i>
        </div>
        <div class="message-content">
            ${imageHtml}
            <div class="message-text">${content}</div>
            <div class="message-time">${timestamp}</div>
        </div>
    `;
    
    elements.chatMessages.appendChild(messageDiv);
    scrollToBottom();
    
    // Save message to current chat
    if (currentChatId) {
        const chat = chatHistory.find(c => c.id === currentChatId);
        if (chat) {
            chat.messages.push({
                sender,
                content,
                type,
                imageUrl,
                timestamp: new Date()
            });
            saveChatHistory();
        }
    }
}

function generateAIResponse(userMessage) {
    // Simulate different types of responses based on message content
    let response = '';
    
    if (userMessage.toLowerCase().includes('skin') || userMessage.toLowerCase().includes('rash') || userMessage.toLowerCase().includes('mole')) {
        response = `I understand you're asking about skin health. Based on your message, I can provide some general information. However, please remember that this is for educational purposes only and you should consult with a dermatologist for proper medical advice.

For skin concerns, I recommend:
• Taking clear, well-lit photos from multiple angles
• Noting any changes in size, color, or texture
• Monitoring symptoms like itching, pain, or bleeding
• Scheduling a consultation with a healthcare professional

Would you like to upload an image for analysis, or do you have specific questions about skin health?`;
    } else if (userMessage.toLowerCase().includes('upload') || userMessage.toLowerCase().includes('image') || userMessage.toLowerCase().includes('photo')) {
        response = `To upload an image for analysis, please click the paperclip icon (📎) next to the message input. I can analyze images of skin conditions and provide general observations.

Please ensure your image is:
• Clear and well-lit
• Shows the area of concern clearly
• Taken from an appropriate distance

Remember, my analysis is for informational purposes only and should not replace professional medical evaluation.`;
    } else if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
        response = `Hello! I'm SkinAI, your AI assistant for skin health analysis. I'm here to help you with questions about skin conditions and can analyze images you upload.

How can I assist you today? You can:
• Ask questions about skin health
• Upload images for analysis
• Get general guidance on skin care
• Learn about when to see a healthcare professional`;
    } else {
        response = `Thank you for your question. I'm specialized in skin health analysis and dermatological guidance. While I can provide general information and analyze skin images, please remember that my responses are for educational purposes only.

For the most accurate diagnosis and treatment recommendations, always consult with a qualified healthcare professional or dermatologist.

Is there a specific skin concern you'd like to discuss, or would you like to upload an image for analysis?`;
    }
    
    addMessage('bot', response);
}

function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

function autoResizeTextarea() {
    const textarea = elements.messageInput;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

function showTypingIndicator() {
    elements.typingIndicator.style.display = 'flex';
    scrollToBottom();
}

function hideTypingIndicator() {
    elements.typingIndicator.style.display = 'none';
}

function scrollToBottom() {
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

// File Upload Functions
function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        showNotification('Please upload an image file', 'error');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showNotification('Image size should be less than 5MB', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageUrl = e.target.result;
        addMessage('user', 'Uploaded an image for analysis', 'image', imageUrl);
        
        // Show typing indicator and generate AI response for image
        showTypingIndicator();
        setTimeout(() => {
            hideTypingIndicator();
            analyzeImage(imageUrl);
        }, 2000);
    };
    
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset file input
}

function analyzeImage(imageUrl) {
    const response = `I've analyzed the uploaded image. Here's my preliminary assessment:

🔍 **Visual Analysis:**
• The image shows skin tissue that appears to have some variation in pigmentation
• I can observe the general structure and coloration patterns
• The area appears to be photographed under adequate lighting

⚠️ **Important Medical Disclaimer:**
This AI analysis is for informational purposes only and cannot replace professional medical evaluation. I cannot provide definitive diagnoses.

📋 **Recommendations:**
• Schedule a consultation with a dermatologist for proper evaluation
• Monitor any changes in size, color, shape, or texture
• Take note of any symptoms like itching, pain, or bleeding
• Consider getting regular skin checks if you have risk factors

🏥 **When to Seek Immediate Care:**
• Rapid changes in appearance
• Bleeding or ulceration
• Persistent itching or pain
• Any concerns about the appearance

Would you like general information about skin health monitoring or guidance on preparing for a dermatologist visit?`;

    addMessage('bot', response);
}

// Voice Recording Functions
async function toggleVoiceRecording() {
    if (!isRecording) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            startRecording(stream);
        } catch (error) {
            showNotification('Microphone access denied', 'error');
        }
    } else {
        stopRecording();
    }
}

function startRecording(stream) {
    isRecording = true;
    audioChunks = [];
    elements.voiceBtn.classList.add('recording');
    elements.voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
    
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (e) => {
        audioChunks.push(e.data);
    };
    
    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        processAudioRecording(audioBlob);
        stream.getTracks().forEach(track => track.stop());
    };
    
    mediaRecorder.start();
    showNotification('Recording started...', 'info');
}

function stopRecording() {
    isRecording = false;
    elements.voiceBtn.classList.remove('recording');
    elements.voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
    }
    
    showNotification('Recording stopped', 'info');
}

function processAudioRecording(audioBlob) {
    // Simulate speech-to-text conversion
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        const transcribedText = "Hello, I have a question about a mole on my arm that has been changing color recently.";
        elements.messageInput.value = transcribedText;
        autoResizeTextarea();
        showNotification('Voice message transcribed', 'success');
    }, 2000);
}

// Chat History Functions
function loadChatHistory() {
    const stored = localStorage.getItem('skinai_chats');
    if (stored) {
        chatHistory = JSON.parse(stored);
        
        // Update existing chats to include isPinned property if it doesn't exist
        chatHistory.forEach(chat => {
            if (chat.isPinned === undefined) {
                chat.isPinned = false;
            }
        });
        
        updateChatList();
    }
}

function saveChatHistory() {
    localStorage.setItem('skinai_chats', JSON.stringify(chatHistory));
}

function updateChatList() {
    elements.chatList.innerHTML = '';
    
    // Sort chats: pinned first, then by timestamp
    const sortedChats = [...chatHistory].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.timestamp) - new Date(a.timestamp);
    });
    
    const pinnedChats = sortedChats.filter(chat => chat.isPinned);
    const unpinnedChats = sortedChats.filter(chat => !chat.isPinned);
    
    // Add pinned chats
    pinnedChats.forEach(chat => {
        const chatItem = createChatItem(chat);
        elements.chatList.appendChild(chatItem);
    });
    
    // Add separator if there are both pinned and unpinned chats
    if (pinnedChats.length > 0 && unpinnedChats.length > 0) {
        const separator = document.createElement('div');
        separator.className = 'chat-separator';
        separator.innerHTML = '<span>Recent Chats</span>';
        elements.chatList.appendChild(separator);
    }
    
    // Add unpinned chats
    unpinnedChats.forEach(chat => {
        const chatItem = createChatItem(chat);
        elements.chatList.appendChild(chatItem);
    });
}

function createChatItem(chat) {
    const chatItem = document.createElement('div');
    chatItem.className = 'chat-item';
    if (chat.id === currentChatId) {
        chatItem.classList.add('active');
    }
    if (chat.isPinned) {
        chatItem.classList.add('pinned');
    }
    
    const timeAgo = getTimeAgo(new Date(chat.timestamp));
    
    chatItem.innerHTML = `
        <div class="chat-item-content">
            <div class="chat-item-title">
                ${chat.isPinned ? '<i class="fas fa-thumbtack pin-icon"></i>' : ''}
                ${chat.title}
            </div>
            <div class="chat-item-time">${timeAgo}</div>
        </div>
        <div class="chat-actions">
            <button class="chat-action-btn pin-btn ${chat.isPinned ? 'pinned' : ''}" 
                    title="${chat.isPinned ? 'Unpin' : 'Pin'} conversation">
                <i class="fas fa-thumbtack"></i>
            </button>
            <button class="chat-action-btn delete-btn" 
                    title="Delete conversation">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    // Add click event for loading chat (only on the content area)
    chatItem.querySelector('.chat-item-content').addEventListener('click', () => loadChat(chat.id));
    
    // Add pin functionality
    const pinBtn = chatItem.querySelector('.pin-btn');
    pinBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePinChat(chat.id);
    });
    
    // Add delete functionality
    const deleteBtn = chatItem.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteChat(chat.id);
    });
    
    return chatItem;
}

function loadChat(chatId) {
    const chat = chatHistory.find(c => c.id === chatId);
    if (!chat) return;
    
    currentChatId = chatId;
    elements.chatMessages.innerHTML = '';
    
    // Add welcome message if no messages
    if (chat.messages.length === 0) {
        elements.chatMessages.innerHTML = `
            <div class="welcome-message">
                <div class="welcome-icon">
                    <i class="fas fa-robot"></i>
                </div>
                <h3>Welcome to SkinAI</h3>
                <p>I'm your AI assistant for skin health analysis. You can:</p>
                <ul>
                    <li>Upload images of skin conditions for analysis</li>
                    <li>Ask questions about skin health</li>
                    <li>Get personalized recommendations</li>
                    <li>Record voice messages for easier interaction</li>
                </ul>
                <p class="disclaimer">⚠️ This AI assistant is for informational purposes only and should not replace professional medical advice.</p>
            </div>
        `;
    } else {
        // Load chat messages
        chat.messages.forEach(msg => {
            addMessageFromHistory(msg);
        });
    }
    
    updateChatList();
    scrollToBottom();
}

function addMessageFromHistory(msg) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${msg.sender}`;
    
    const timestamp = new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    let imageHtml = '';
    if (msg.imageUrl && msg.type === 'image') {
        imageHtml = `<img src="${msg.imageUrl}" alt="Uploaded image" class="message-image">`;
    }
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-${msg.sender === 'user' ? 'user' : 'robot'}"></i>
        </div>
        <div class="message-content">
            ${imageHtml}
            <div class="message-text">${msg.content}</div>
            <div class="message-time">${timestamp}</div>
        </div>
    `;
    
    elements.chatMessages.appendChild(messageDiv);
}

function updateChatTitle(message) {
    const chat = chatHistory.find(c => c.id === currentChatId);
    if (chat && chat.title === 'New Conversation') {
        chat.title = message.length > 30 ? message.substring(0, 30) + '...' : message;
        updateChatList();
        saveChatHistory();
    }
}

function togglePinChat(chatId) {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
        chat.isPinned = !chat.isPinned;
        updateChatList();
        saveChatHistory();
    }
}

function deleteChat(chatId) {
    // Show confirmation dialog
    if (confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
        const chatIndex = chatHistory.findIndex(c => c.id === chatId);
        if (chatIndex !== -1) {
            const wasCurrentChat = chatId === currentChatId;
            
            // Remove chat from history
            chatHistory.splice(chatIndex, 1);
            
            // If we deleted the current chat, start a new one
            if (wasCurrentChat) {
                if (chatHistory.length > 0) {
                    // Load the most recent chat
                    const sortedChats = [...chatHistory].sort((a, b) => {
                        if (a.isPinned && !b.isPinned) return -1;
                        if (!a.isPinned && b.isPinned) return 1;
                        return new Date(b.timestamp) - new Date(a.timestamp);
                    });
                    loadChat(sortedChats[0].id);
                } else {
                    // No chats left, start a new one
                    startNewChat();
                }
            }
            
            updateChatList();
            saveChatHistory();
        }
    }
}

// Utility Functions
function showLoading() {
    elements.loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    elements.loadingOverlay.style.display = 'none';
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#e53e3e' : '#667eea'};
        color: white;
        border-radius: 8px;
        font-weight: 500;
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
}

function handleWindowResize() {
    // Reset sidebar state on window resize
    if (window.innerWidth > 768) {
        // Desktop: Remove mobile classes and overlay
        elements.sidebar.classList.remove('mobile-open');
        elements.sidebarOverlay.classList.remove('active');
        if (isSidebarCollapsed) {
            elements.sidebar.classList.add('collapsed');
        } else {
            elements.sidebar.classList.remove('collapsed');
        }
    } else {
        // Mobile: Handle mobile sidebar
        elements.sidebar.classList.remove('collapsed');
        if (!isSidebarCollapsed) {
            elements.sidebar.classList.add('mobile-open');
            elements.sidebarOverlay.classList.add('active');
        } else {
            elements.sidebar.classList.remove('mobile-open');
            elements.sidebarOverlay.classList.remove('active');
        }
    }
}

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);

// Initialize with a new chat
startNewChat();
