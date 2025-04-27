import styles from './App.module.css';
import Banner from './components/Banner';
import ChatInput from './components/ChatInput';
import MessageBubble from './components/MessageBubble';
import { useState } from 'react';

function App() {
    const [messages, setMessages] = useState([]);

    const handleSendMessage = async (text) => {
        const userMessage = { sender: 'user', text };
        setMessages((prev) => [...prev, userMessage]);

        try {
            const response = await fetch('http://localhost:5000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text }),
            });

            const data = await response.json();
            const botMessage = { sender: 'bot', text: data.reply };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = { sender: 'bot', text: 'Something went wrong. Please try again.' };
            setMessages((prev) => [...prev, errorMessage]);
        }
    };

    return (
        <div className={styles.container}>
            <Banner />
            <div className={styles.chatWindow}>
                {messages.map((msg, index) => (
                    <MessageBubble key={index} sender={msg.sender} text={msg.text} />
                ))}
            </div>
            <ChatInput onSend={handleSendMessage} />
        </div>
    );
}

export default App;
