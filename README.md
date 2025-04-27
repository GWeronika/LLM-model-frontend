# LLM Chat UI

A lightweight and elegant chat interface for interacting with a Large Language Model (LLM), built with **React** and a basic **Node.js (Express)** backend.  
Currently using a simple mock bot reply for testing purposes — future versions will connect to a real LLM backend.

---

## Features

- Responsive chat UI (desktop & mobile)
- User and bot message styling
- Smooth text input with Enter-to-send
- Modular component structure (Banner, ChatInput, MessageBubble)
- Basic backend server (`server.js`) ready for API requests
- Easy local development (frontend + backend) with **one command**

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18+ recommended)
- [npm](https://www.npmjs.com/)

---

### Installation

Follow these steps to set up the project locally:

1. **Clone the repository:**

```bash
git clone https://github.com/GWeronika/LLM-model-frontend.git
cd LLM-model-frontend
```

2. **Install all dependencies:**

```bash
npm install
```

---

### Running the App

You have two options depending on your preference:

#### Option 1: Start frontend and backend separately

1. **Backend Server:**

Open the first terminal and run:

```bash
npm run server
```

This will start the backend server at **http://localhost:5000**.

2. **Frontend (React app):**

Open the second terminal and run:

```bash
npm start
```

This will start the frontend React app at **http://localhost:3000**.

The frontend will automatically proxy requests to the backend at **/chat** due to the proxy setup in `package.json`.

---

#### Option 2: Start frontend and backend together (recommended)

In a single terminal, run:

```bash
npm run dev
```

This command will:
- Start the backend server at **http://localhost:5000**
- Start the frontend React app at **http://localhost:3000**
- Handle proxying API requests between frontend and backend

_This method uses the `concurrently` package to run both the backend and frontend at the same time._

---

## Project Structure

Here is the structure of the project:

```
LLM-model-frontend/
 ├── public/
 │    ├── img.png (Preview Image)
 ├── src/
 │    ├── components/
 │    │    ├── Banner.jsx
 │    │    ├── ChatInput.jsx
 │    │    ├── MessageBubble.jsx
 │    ├── App.jsx
 │    ├── App.module.css
 │    └── index.js
 ├── server.js (Backend server)
 ├── package.json (Frontend + backend scripts)
 └── README.md
```

Each major UI element (Banner, Input, Message Bubble) is modular and styled separately using **CSS Modules**.

---

## Backend Server (`server.js`)

The backend server is an **Express** server that:

- Accepts `POST` requests to `/chat`
- Logs the received user message
- Returns a mock reply (`"Mock reply to: your message"`)

---

## Future LLM Integration

In the future, this app will integrate with a real LLM backend. The flow will work like this:

1. User sends a message from the frontend chat UI.
2. Frontend sends a POST request to the backend `/chat` endpoint.
3. The backend forwards the message to a local LLM.
4. LLM generates a response based on the user input.
5. The backend sends the LLM reply back to the frontend to display in the chat UI.

Here is the pseudocode of how the API call will look like in the future:

```javascript
const handleSendMessage = async (text) => {
  const userMessage = { sender: 'user', text };
  setMessages((prev) => [...prev, userMessage]);

  try {
    const response = await fetch('/chat', {
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

---

## Preview

![img.png](public/img.png)

---

## Available Scripts

The following scripts are available to run the app:

| Script | Description |
|:------|:------------|
| `npm start` | Starts the React frontend (localhost:3000) |
| `npm run server` | Starts the Node.js backend server (localhost:5000) |
| `npm run dev` | Starts both frontend and backend simultaneously using `concurrently` |

---

## TODO

- [ ] Connect to a real LLM backend
- [ ] Add typing indicator ("Bot is typing...")
- [ ] Add better error handling for API failures
- [ ] Save message history (e.g., using `localStorage` or a backend database)
- [ ] Enhance mobile UX (animations, better keyboard handling)
