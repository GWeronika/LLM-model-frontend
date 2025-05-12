import { useState, useEffect } from 'react';
import styles from './App.module.css';
import Banner from './components/Banner';
import ChatInput from './components/ChatInput';
import MessageBubble from './components/MessageBubble';
import Sidebar from './components/Sidebar';
import CategorySelector from './components/CategorySelector';

function App() {
    const [currentScreen, setCurrentScreen] = useState('chat'); // possible are 'chat' and 'category'
    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [activeConversationId, setActiveConversationId] = useState(null);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await fetch('http://localhost:5000/conversations');
                const data = await response.json();
                setConversations(data);
            } catch (error) {
                console.error('Failed to fetch conversations:', error);
            }
        };
        fetchConversations();
    }, []);

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

    const handleSelectConversation = (id) => {
        const conv = conversations.find((c) => c.id === id);
        if (conv) {
            setMessages(conv.messages);
            setActiveConversationId(id);
        }
    };

    const handleCreateNew = () => {
        setCurrentScreen('category');
    };

    const handleCategorySelect = async (category) => {
        try {
            const response = await fetch('http://localhost:5000/conversations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category }),
            });

            const newConv = await response.json();
            setConversations((prev) => [newConv, ...prev]);
            setActiveConversationId(newConv.id);
            setMessages([]);
            setCurrentScreen('chat');
        } catch (error) {
            console.error('Failed to create new conversation:', error);
        }
    };

    const handleDeleteConversation = async (id) => {
        try {
            await fetch(`http://localhost:5000/conversations/${id}`, {
                method: 'DELETE',
            });
            setConversations((prev) => prev.filter((c) => c.id !== id));

            if (activeConversationId === id) {
                setMessages([]);
                setActiveConversationId(null);
            }
        } catch (error) {
            console.error('Failed to delete conversation:', error);
        }
    };

    return (
        <div className={styles.appContainer}>
            <Sidebar
                conversations={conversations}
                onSelectConversation={handleSelectConversation}
                onCreateNew={handleCreateNew}
                onDeleteConversation={handleDeleteConversation}
                activeConversationId={activeConversationId}
            />
            <div className={styles.mainContent}>
                {currentScreen === 'category' ? (
                    <CategorySelector
                        onSelect={handleCategorySelect}
                        onCancel={() => setCurrentScreen("chat")}
                    />
                    ) : (
                    <>
                        <Banner />
                        <div className={styles.chatWindow}>
                            {messages.map((msg, index) => (
                                <MessageBubble key={index} sender={msg.sender} text={msg.text} />
                            ))}
                        </div>
                        <ChatInput onSend={handleSendMessage} />
                    </>
                )}
            </div>
        </div>
    );
}

export default App;
