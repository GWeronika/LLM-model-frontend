import { useState } from 'react';
import styles from './Sidebar.module.css';

function Sidebar({ conversations, onSelectConversation, onCreateNew, onDeleteConversation, activeConversationId }) {
    const [isOpen, setIsOpen] = useState(true);
    const [hoveredTitle, setHoveredTitle] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

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
                                    className={`${styles.item} ${conv.id === activeConversationId ? styles.active : ''}`}
                                    onClick={() => onSelectConversation(conv.id)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.getBoundingClientRect();
                                        setHoveredTitle(conv.title);
                                        setTooltipPosition({
                                            top: e.clientY + 10,
                                            left: e.clientX + 10,
                                        });
                                    }}
                                    onMouseLeave={() => setHoveredTitle(null)}
                                >
                                    <span className={styles.titleText}>
                                        {conv.title.length > 50
                                            ? conv.title.slice(0, 47) + '...'
                                            : conv.title}
                                    </span>
                                    <i
                                        className={`fa-solid fa-trash-can ${styles.trashIcon}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteConversation(conv.id);
                                        }}
                                        title="Delete conversation"
                                    ></i>
                                </li>
                            ))}
                    </ul>
                    {hoveredTitle && (
                        <div
                            className={styles.tooltip}
                            style={{
                                top: tooltipPosition.top,
                                left: tooltipPosition.left,
                            }}
                        >
                            {hoveredTitle}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Sidebar;
