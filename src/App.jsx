import { useState, useEffect } from 'react';
import styles from './App.module.css';
import Banner from './components/Banner';
import ChatInput from './components/ChatInput';
import MessageBubble from './components/MessageBubble';
import Sidebar from './components/Sidebar';
import CodeEditor from "./components/CodeEditor";
import CategorySelector from './components/CategorySelector';
import ConversationTitle from './components/ConversationTitle';
import { suggestFileName } from "./utils/suggestFileName";


function App() {
    const [currentScreen, setCurrentScreen] = useState('chat');
    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileContent, setFileContent] = useState('');

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await fetch('/conversations');
                const data = await response.json();
                setConversations(data);
            } catch (error) {
                console.error('Failed to fetch conversations:', error);
            }
        };
        fetchConversations();
    }, []);

    const fetchFiles = async () => {
        try {
            const response = await fetch('/files/list');
            if (!response.ok) throw new Error('Failed to fetch files');
            const data = await response.json();
            setFiles(data);
        } catch (error) {
            console.error('Failed to fetch files:', error);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleSendMessage = async (text) => {
        const userMessage = { sender: 'user', text };
        setMessages(prev => [...prev, userMessage]);

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text }),
            });

            const data = await response.json();
            const botMessage = { sender: 'bot', text: data.reply };
            setMessages(prev => [...prev, botMessage]);

            if (containsCode(data.reply)) {
                if (!activeConversationId) {
                    console.warn('No active conversation ID');
                } else {
                    const fileName = `${suggestFileName(data.reply)}-${activeConversationId}.txt`;
                    const saveRes = await fetch('/files/save-code', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ conversationText: data.reply, fileName }),
                    });
                    if (!saveRes.ok) {
                        const err = await saveRes.json();
                        throw new Error(err.error || 'Błąd zapisu kodu');
                    }
                    await fetchFiles();
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = { sender: 'bot', text: 'Something went wrong. Please try again.' };
            setMessages(prev => [...prev, errorMessage]);
        }
    };

    const handleSelectConversation = (id) => {
        const conv = conversations.find((c) => c.id === id);
        if (conv) {
            setMessages(conv.messages);
            setActiveConversationId(id);
            setSelectedFile(null);
        }
    };

    const handleCreateNew = () => {
        setCurrentScreen('category');
    };

    const handleCategorySelect = async (category) => {
        try {
            const response = await fetch('/conversations', {
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

    const handleSelectFile = async (fileName) => {
        try {
            const res = await fetch(`/files/${fileName}`);
            if (!res.ok) throw new Error('Failed to load file content');
            const content = await res.text();
            setSelectedFile(fileName);
            setFileContent(content);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteFile = async (fileName) => {
        try {
            const res = await fetch(`/files/${fileName}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete file');
            await fetchFiles();
            if (selectedFile === fileName) {
                setSelectedFile(null);
                setFileContent('');
            }
        } catch (error) {
            console.error('Failed to delete file:', error);
        }
    };

    const handleDeleteConversation = async (id) => {
        try {
            await fetch(`/conversations/${id}`, {
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

    const handleUpdateTitle = async (id, newTitle) => {
        try {
            const response = await fetch(`/conversations/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newTitle }),
            });
            const updatedConversation = await response.json();
            setConversations((prev) =>
                prev.map((conv) =>
                    conv.id === id ? { ...conv, title: updatedConversation.title } : conv
                )
            );
        } catch (error) {
            console.error('Failed to update conversation title:', error);
        }
    };

    function containsCode(text) {
        return text.includes('```');
    }

    return (
        <div className={styles.appContainer}>
            <Sidebar
                conversations={conversations}
                onSelectConversation={handleSelectConversation}
                onCreateNew={handleCreateNew}
                onDeleteConversation={handleDeleteConversation}
                onUpdateTitle={handleUpdateTitle}
                activeConversationId={activeConversationId}
                files={files}
                onSelectFile={handleSelectFile}
                onDeleteFile={handleDeleteFile}
            />
            <div className={styles.mainContent}>
                <Banner />
                {currentScreen === 'category' ? (
                    <CategorySelector
                        onSelect={handleCategorySelect}
                        onCancel={() => setCurrentScreen("chat")}
                    />
                ) : selectedFile ? (
                    <CodeEditor
                        fileName={selectedFile}
                        content={fileContent}
                        onChange={(newContent) => setFileContent(newContent)}
                        onSave={async () => {
                            try {
                                const res = await fetch(`/files/save-code`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ fileName: selectedFile, content: fileContent }),
                                });
                                if (!res.ok) throw new Error('Save failed');
                                alert('Saved!');
                            } catch (e) {
                                console.error(e);
                                alert('Failed to save file');
                            }
                        }}
                        onClose={() => setSelectedFile(null)}
                    />
                ) : (
                    <>
                        <ConversationTitle
                            conversations={conversations}
                            activeConversationId={activeConversationId}
                            onUpdateTitle={handleUpdateTitle}
                        />
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
