// Chatbot AI Logic
class Chatbot {
    constructor() {
        this.responses = {
            greetings: {
                patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'],
                responses: [
                    "Hello! How can I assist you?",
                    "Hi there! What can I help you with?",
                    "Hey! Nice to meet you. How may I help?",
                    "Greetings! I'm here to help. What do you need?"
                ]
            },
            farewells: {
                patterns: ['bye', 'goodbye', 'see you', 'farewell', 'later', 'cya'],
                responses: [
                    "Goodbye! Have a great day!",
                    "See you later! Take care!",
                    "Farewell! Feel free to come back anytime!",
                    "Bye! It was nice chatting with you!"
                ]
            },
            help: {
                patterns: ['help', 'what can you do', 'what do you do', 'capabilities', 'features'],
                responses: [
                    "I'm an AI chatbot designed to help answer questions, have conversations, and assist with various tasks. Feel free to ask me anything!",
                    "I can help you with questions, have conversations, provide information, and assist with various topics. What would you like to know?",
                    "I'm here to chat and help! I can answer questions, discuss topics, and assist you. What do you need help with?"
                ]
            },
            weather: {
                patterns: ['weather', 'temperature', 'rain', 'sunny', 'cloudy'],
                responses: [
                    "I don't have access to real-time weather data, but I'd be happy to help you find weather information or discuss weather-related topics!",
                    "For current weather information, I'd recommend checking a weather service. Is there something specific about weather you'd like to know?"
                ]
            },
            time: {
                patterns: ['time', 'what time', 'current time', 'clock'],
                responses: [
                    `The current time is ${new Date().toLocaleTimeString()}.`,
                    `It's ${new Date().toLocaleTimeString()} right now.`
                ]
            },
            date: {
                patterns: ['date', 'what date', 'today', 'day'],
                responses: [
                    `Today's date is ${new Date().toLocaleDateString()}.`,
                    `It's ${new Date().toLocaleDateString()} today.`
                ]
            },
            default: {
                responses: [
                    "That's interesting! Can you tell me more about that?",
                    "I see. How can I help you with that?",
                    "I understand. What else would you like to know?",
                    "That's a good point. Let me think about that...",
                    "I'm here to help! Could you provide more details?",
                    "Interesting! Is there anything specific you'd like to explore about this topic?"
                ]
            }
        };
    }

    findResponse(userMessage) {
        const message = userMessage.toLowerCase().trim();
        
        // Check each category
        for (const [category, data] of Object.entries(this.responses)) {
            if (category === 'default') continue;
            
            for (const pattern of data.patterns) {
                if (message.includes(pattern)) {
                    const responses = data.responses;
                    return responses[Math.floor(Math.random() * responses.length)];
                }
            }
        }
        
        // Default response
        const defaultResponses = this.responses.default.responses;
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    async getResponse(userMessage) {
        // Simulate thinking time
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
        return this.findResponse(userMessage);
    }
}

// Chat UI Controller
class ChatUI {
    constructor() {
        this.chatbot = new Chatbot();
        this.chatMessages = document.getElementById('chatMessages');
        this.userInput = document.getElementById('userInput');
        this.sendButton = document.getElementById('sendButton');
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.sendButton.addEventListener('click', () => this.handleSendMessage());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSendMessage();
            }
        });
    }

    addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = isUser ? '👤' : '🤖';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        const paragraph = document.createElement('p');
        paragraph.textContent = content;
        messageContent.appendChild(paragraph);
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message';
        typingDiv.id = 'typingIndicator';
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = '🤖';
        
        const typingContent = document.createElement('div');
        typingContent.className = 'message-content typing-indicator';
        typingContent.innerHTML = '<span></span><span></span><span></span>';
        
        typingDiv.appendChild(avatar);
        typingDiv.appendChild(typingContent);
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }

    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    async handleSendMessage() {
        const message = this.userInput.value.trim();
        
        if (!message) return;
        
        // Disable input while processing
        this.userInput.disabled = true;
        this.sendButton.disabled = true;
        
        // Add user message
        this.addMessage(message, true);
        this.userInput.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Get bot response
        const response = await this.chatbot.getResponse(message);
        
        // Remove typing indicator
        this.removeTypingIndicator();
        
        // Add bot response
        this.addMessage(response, false);
        
        // Re-enable input
        this.userInput.disabled = false;
        this.sendButton.disabled = false;
        this.userInput.focus();
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

// Initialize the chat when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const chatUI = new ChatUI();
    document.getElementById('userInput').focus();
});

