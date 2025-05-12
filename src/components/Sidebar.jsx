import { useState } from 'react';
import styles from './Sidebar.module.css';

function Sidebar({ conversations, onSelectConversation, onCreateNew, activeConversationId }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
            <button className={styles.toggleButton} onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? '←' : '→'}
            </button>
            {isOpen && (
                <div className={styles.content}>
                    <button className={styles.newButton} onClick={onCreateNew}>
                        Create new conversation
                    </button>
                    <h2 className={styles.header}>Conversations</h2>
                    <ul className={styles.list}>
                        {conversations
                            .sort((a, b) => new Date(b.updateDate) - new Date(a.updateDate))
                            .map((conv) => (
                                <li
                                    key={conv.id}
                                    onClick={() => onSelectConversation(conv.id)}
                                    className={`${styles.item} ${conv.id === activeConversationId ? styles.active : ''}`}
                                    title={conv.title}
                                >
                                    {conv.title.length > 50
                                        ? conv.title.slice(0, 47) + '...'
                                        : conv.title}
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Sidebar;
