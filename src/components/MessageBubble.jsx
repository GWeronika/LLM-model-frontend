import styles from './MessageBubble.module.css';

function MessageBubble({ sender, text }) {
    const isUser = sender === "user";

    return (
        <div className={styles.bubbleContainer}>
            <div className={`${styles.bubble} ${isUser ? styles.user : styles.bot}`}>
                {text}
            </div>
        </div>
    );
}

export default MessageBubble;
