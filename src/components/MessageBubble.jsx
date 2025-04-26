function MessageBubble({ sender, text }) {
    const isUser = sender === "user";

    return (
        <div>
            <div className={isUser ? 'user' : 'bot'}>
                {text}
            </div>
        </div>
    );
}

export default MessageBubble;
