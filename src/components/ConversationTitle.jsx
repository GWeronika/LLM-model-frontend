import React, { useState } from 'react';
import styles from './ConversationTitle.module.css';

function ConversationTitle({ conversations, activeConversationId }) {
    const activeConversation = conversations.find(
        (conv) => conv.id === activeConversationId
    );
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className={styles.titleContainer}>
            {activeConversation ? (
                <div
                    className={styles.titleWrapper}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <h3 className={styles.title}>
                        {activeConversation.title.length > 40
                            ? activeConversation.title.slice(0, 37) + '...'
                            : activeConversation.title}
                    </h3>
                    {isHovered && activeConversation.title.length > 30 && (
                        <div className={styles.tooltip}>
                            {activeConversation.title}
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
