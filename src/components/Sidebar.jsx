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
                {isOpen && (
                    <button className={styles.newButton} onClick={onCreateNew}>
                        New Conversation
                    </button>
                )}
                <button className={styles.toggleButton} onClick={() => setIsOpen(!isOpen)}>
                    <i className={`fa-regular ${isOpen ? "fa-circle-left" : "fa-circle-right"} fa-lg`}></i>
                </button>
            </div>
            {isOpen && (
                <div className={styles.content}>
                    <div className={styles.tabsContainer}>
                        <div className={styles.tabHeader} onClick={() => toggleTab("conversations")}>
                            Conversations {expandedTab === "conversations" ? "▲" : "▼"}
                        </div>
                        {expandedTab === "conversations" && (
                            <div className={styles.tabContent}>
                                <ConversationsTab
                                    conversations={conversations}
                                    onSelectConversation={onSelectConversation}
                                    onCreateNew={onCreateNew}
                                    onDeleteConversation={onDeleteConversation}
                                    onUpdateTitle={onUpdateTitle}
                                    activeConversationId={activeConversationId}
                                />
                            </div>
                        )}
                        <div className={styles.tabHeader} onClick={() => toggleTab("files")}>
                            Files {expandedTab === "files" ? "▲" : "▼"}
                        </div>
                        {expandedTab === "files" && (
                            <div className={styles.tabContent}>
                                <FilesTab files={files} onSelectFile={onSelectFile} onDeleteFile={onDeleteFile} />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}