import { useState } from "react";
import styles from "./Sidebar.module.css";

export default function ConversationsTab({
                                             conversations,
                                             onSelectConversation,
                                             onDeleteConversation,
                                             activeConversationId,
                                         }) {
    const [hoveredTitle, setHoveredTitle] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const sortedConversations = Array.isArray(conversations)
        ? [...conversations]
            .filter(conv => conv && typeof conv.title === 'string') // usuwamy nieprawidłowe elementy
            .sort((a, b) => new Date(b.updateDate) - new Date(a.updateDate))
        : [];

    return (
        <>
            <ul className={styles.list}>
                {sortedConversations.map((conv) => (
                    <li
                        key={conv.id}
                        className={`${styles.item} ${conv.id === activeConversationId ? styles.active : ""}`}
                        onClick={() => onSelectConversation(conv.id)}
                        onMouseEnter={(e) => {
                            setHoveredTitle(conv.title);
                            setTooltipPosition({ top: e.clientY + 10, left: e.clientX + 10 });
                        }}
                        onMouseLeave={() => setHoveredTitle(null)}
                    >
                        <span className={styles.titleText}>
                            {(conv.title || "").length > 50 ? (conv.title || "").slice(0, 47) + "…" : (conv.title || "")}
                        </span>
                        <i
                            className={`fa-solid fa-trash-can ${styles.trashIcon}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteConversation(conv.id);
                            }}
                            title="Delete conversation"
                        />
                    </li>
                ))}
            </ul>
            {hoveredTitle && (
                <div className={styles.tooltip} style={{ top: tooltipPosition.top, left: tooltipPosition.left }}>
                    {hoveredTitle}
                </div>
            )}
        </>
    );
}
