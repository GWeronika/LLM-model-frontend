import { useState } from "react";
import ConversationsTab from "./ConversationsTab";
import FilesTab from "./FilesTab";
import styles from "./Sidebar.module.css";

export default function Sidebar({
                                    conversations,
                                    onSelectConversation,
                                    onCreateNew,
                                    onDeleteConversation,
                                    onUpdateTitle,
                                    activeConversationId,
                                    files,
                                    onSelectFile,
                                    onDeleteFile,
                                }) {
    const [isOpen, setIsOpen] = useState(true);
    const [expandedTab, setExpandedTab] = useState("conversations");

    const toggleTab = (tab) => setExpandedTab((prev) => (prev === tab ? null : tab));

    return (
        <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
            <div className={styles.headerControls}>
                <button className={styles.newButton} onClick={onCreateNew}>
                    New Conversation
                </button>
                <button className={styles.toggleButton} onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? "←" : "→"}
                </button>
            </div>
            {isOpen && (
                <div className={styles.content}>
                    <div className={styles.tabHeader} onClick={() => toggleTab("conversations")}>Conversations {expandedTab === "conversations" ? "▲" : "▼"}</div>
                    {expandedTab === "conversations" && (
                        <ConversationsTab
                            conversations={conversations}
                            onSelectConversation={onSelectConversation}
                            onCreateNew={onCreateNew}
                            onDeleteConversation={onDeleteConversation}
                            onUpdateTitle={onUpdateTitle}
                            activeConversationId={activeConversationId}
                        />
                    )}

                    <div className={styles.tabHeader} onClick={() => toggleTab("files")}>Files {expandedTab === "files" ? "▲" : "▼"}</div>
                    {expandedTab === "files" && <FilesTab files={files} onSelectFile={onSelectFile} onDeleteFile={onDeleteFile} />}
                </div>
            )}
        </div>
    );
}