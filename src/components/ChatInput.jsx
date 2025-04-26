import { useState } from "react";
import styles from './ChatInput.module.css';

function ChatInput({ onSend }) {
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;
        onSend(input);
        setInput("");
    };

    return (
        <div className={styles.inputContainer}>
            <textarea
                className={styles.inputField}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                rows={1}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                    }
                }}
            />
            <button
                onClick={handleSend}
                className={styles.sendButton}
            >
                Send
            </button>
        </div>
    );
}

export default ChatInput;
