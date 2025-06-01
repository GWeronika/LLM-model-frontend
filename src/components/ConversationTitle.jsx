import React, { useState, useEffect } from 'react';
import styles from './ConversationTitle.module.css';

function ConversationTitle({ conversations, activeConversationId, onUpdateTitle }) {
    const safeConversations = Array.isArray(conversations) ? conversations : [];
    const activeConversation = safeConversations.find(
        (conv) => conv.id === activeConversationId
    );
    const [isHovered, setIsHovered] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(
        activeConversation && typeof activeConversation.title === 'string'
            ? activeConversation.title
            : ''
    );

    useEffect(() => {
        if (activeConversation && typeof activeConversation.title === 'string') {
            setNewTitle(activeConversation.title);
        } else {
            setNewTitle('');
        }
    }, [activeConversation]);

    const handleTitleChange = (e) => {
        setNewTitle(e.target.value);
    };

    const handleBlur = () => {
        setIsEditing(false);
        if (newTitle !== activeConversation.title) {
            onUpdateTitle(activeConversation.id, newTitle);
        }
    };

    const handleTitleClick = () => {
        setIsEditing(true);
    };

    return (
        <div className={styles.titleContainer}>
            {activeConversation ? (
                <div
                    className={styles.titleWrapper}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {isEditing ? (
                        <textarea
                            value={newTitle}
                            onChange={handleTitleChange}
                            onBlur={handleBlur}
                            autoFocus
                            className={styles.editInput}
                        />
                    ) : (
                        <h3 className={styles.title} onClick={handleTitleClick}>
                            {(newTitle || '').length > 40
                                ? (newTitle || '').slice(0, 37) + '...'
                                : (newTitle || '')}
                        </h3>
                    )}
                    {isHovered && newTitle.length > 30 && (
                        <div className={styles.tooltip}>
                            {newTitle}
                        </div>
                    )}
                </div>
            ) : (
                <h3 className={styles.title}>No active conversation</h3>
            )}
        </div>
    );
}

export default ConversationTitle;
