import styles from "./Sidebar.module.css";

export default function FilesTab({ files, onSelectFile, onDeleteFile }) {
    if (!files.length) return <p>No files captured yet.</p>;

    return (
        <ul className={styles.list}>
            {files.map((name) => (
                <li key={name} className={styles.item} onClick={() => onSelectFile(name)}>
                    <span className={styles.titleText}>{name}</span>
                    <i
                        className={`fa-solid fa-trash-can ${styles.trashIcon}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteFile(name);
                        }}
                        title="Delete file"
                    />
                </li>
            ))}
        </ul>
    );
}