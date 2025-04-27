# LLM Chat UI

A lightweight and elegant chat interface for interacting with a Large Language Model (LLM), built with **React**.  
Currently using a simple mock bot reply for testing purposes — future versions will connect to a real LLM backend.

## Features

- Responsive chat UI
- User and bot message styling
- Smooth text input with Enter-to-send
- Basic component structure (Banner, ChatInput, MessageBubble)
- Future-ready for LLM API integration

## Getting Started

Follow these steps to set up the project locally:

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**

```bash
git https://github.com/GWeronika/LLM-model-frontend.git
cd LLM-model-frontend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Start the development server:**

```bash
npm run dev
```


4. Open your browser and navigate to **http://localhost:3000** (using Create React App).

---

## Project Structure

```
src/
 ├── components/
 │    ├── Banner.jsx
 │    ├── ChatInput.jsx
 │    ├── MessageBubble.jsx
 ├── App.jsx
 ├── App.module.css
 └── main.jsx (entry point)
```

Each major UI element (Banner, Input, Message Bubble) is modular and styled separately using CSS Modules.

---

## Future LLM Integration

In future updates, this app will **connect to a real LLM backend**.  
The flow will work like this:

1. After sending a user message, an API call will be made to a server endpoint (e.g., `/api/chat`).
2. The server will forward the message to the LLM (**local LLM like Llama**).
3. The bot response will then be added to the chat UI.

**Example pseudo-code for future API integration:**

```javascript
const handleSendMessage = async (text) => {
  const userMessage = { sender: 'user', text };
  setMessages((prev) => [...prev, userMessage]);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    });

    const data = await response.json();
    const botMessage = { sender: 'bot', text: data.reply };
    setMessages((prev) => [...prev, botMessage]);
  } catch (error) {
    console.error('Failed to fetch bot reply:', error);
  }
};
```

> Note: You will need a backend server to handle requests and communicate with the LLM.

---

## Preview

![img.png](public/img.png)

---

## TODO

- [ ] Real LLM connection (API integration)
- [ ] Typing indicator ("Bot is typing...")
- [ ] Better error handling for API failures
- [ ] Message history saving (localStorage or backend)
- [ ] Improved mobile experience

---
