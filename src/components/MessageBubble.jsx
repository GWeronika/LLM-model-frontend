import styles from './MessageBubble.module.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { detectLanguage } from '../utils/detectLanguage';

function MessageBubble({ sender, text }) {
    const isUser = sender === "user";

    const safeText = typeof text === 'string' ? text : String(text || '');
    const codeBlockMatch = safeText.match(/```(\w+)?\n([\s\S]*?)```/);

    const renderCode = (code, langHint) => (
        <SyntaxHighlighter language={langHint || detectLanguage(code)} style={atomDark}>
            {code}
        </SyntaxHighlighter>
    );

    return (
        <div className={styles.bubbleContainer}>
            <div className={`${styles.bubble} ${isUser ? styles.user : styles.bot}`}>
                {codeBlockMatch ? (
                    <>
                        <p>{safeText.split('```')[0].trim()}</p>
                        {renderCode(codeBlockMatch[2], codeBlockMatch[1])}
                    </>
                ) : (() => {
                    const isCodeish = safeText.split('\n').some(line => detectLanguage(line) !== 'text');
                    return isCodeish ? renderCode(safeText) : <p>{safeText}</p>;
                })()}
            </div>
        </div>
    );
}

export default MessageBubble;
