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

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await fetch('/files/list');
                const data = await response.json();
                setFiles(data);
            } catch (error) {
                console.error('Failed to fetch files:', error);
            }
        };
        fetchFiles();
    }, []);

    const handleSendMessage = async (text) => {
        if (!activeConversationId) {
            alert('Select a conversation first!');
            return;
        }
        const userMessage = { sender: 'user', text };
        setMessages((prev) => [...prev, userMessage]);

        try {
            await fetch(`/conversations/${activeConversationId}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, userQuery: true }),
            });
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text }),
            });

            const data = await response.json();
            const botText = data.reply;
            const botMessage = { sender: 'bot', text: botText };
            await fetch(`/conversations/${activeConversationId}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: botText, userQuery: false }),
            });

            setMessages((prev) => [...prev, botMessage]);
            if (containsCode(botText)) {
                const codeBlocks = extractCodeBlocks(botText);
                for (let block of codeBlocks) {
                    const fileName = suggestFileName(block.lang || 'txt', block.code);
                    try {
                        await saveCodeToFile(block.code, fileName);
                        setFiles((prev) => [...prev, fileName]);
                    } catch (e) {
                        console.error('Błąd zapisu kodu:', e.message);
                    }
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = { sender: 'bot', text: 'Something went wrong. Please try again.' };
            setMessages((prev) => [...prev, errorMessage]);
        }
    };

    function extractCodeBlocks(text) {
        const regex = /```(\w*)\n([\s\S]*?)```/g;
        const blocks = [];
        let match;
        while ((match = regex.exec(text)) !== null) {
            blocks.push({ lang: match[1], code: match[2] });
        }
        return blocks;
    }

    async function saveCodeToFile(codeText, fileName) {
        const res = await fetch('/files/save-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                conversationText: `\`\`\`\n${codeText}\n\`\`\``,
                fileName,
            }),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Błąd zapisu');
        }

        const data = await res.json();
        console.log(data.message);
    }

    const handleSelectConversation = async (id) => {
        try {
            setActiveConversationId(id);
            setSelectedFile(null);
            setMessages([]);

            const res = await fetch(`/conversations/${id}/messages`);
            if (!res.ok) throw new Error('Failed to load messages');
            const msgs = await res.json();
            setMessages(msgs);
        } catch (error) {
            console.error('Failed to load conversation messages:', error);
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
            const text = await res.text();
            setSelectedFile(fileName);
            setFileContent(text.content);
        } catch (error) {
            console.error(error);
        }
    };


    const handleDeleteFile = async (fileName) => {
        try {
            const res = await fetch(`/files/${fileName}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete file');

            setFiles(prev => prev.filter(f => f !== fileName));
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
            if (!response.ok) {
                const text = await response.text();
                throw new Error(`HTTP ${response.status}: ${text}`);
            }

            setConversations((prev) =>
                prev.map((conv) =>
                    conv.id === id ? { ...conv, title: newTitle } : conv
                )
            );
        } catch (error) {
            console.error('Failed to update conversation title:', error);
            alert(`Failed to update conversation title: ${error.message}`);
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
