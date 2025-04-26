import Banner from './components/Banner';
import ChatInput from './components/ChatInput';
import MessageBubble from './components/MessageBubble';
import { useState } from 'react';
import styles from './App.module.css';

function App() {
    const [messages, setMessages] = useState([]);

    const handleSendMessage = (text) => {
        const userMessage = { sender: 'user', text };
        setMessages((prev) => [...prev, userMessage]);

        setTimeout(() => {
            const botMessage = { sender: 'bot', text: `Reply to: "${text}"` };
            setMessages((prev) => [...prev, botMessage]);
        }, 500);
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
