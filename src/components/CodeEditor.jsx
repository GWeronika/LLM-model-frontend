import { useState, useEffect } from "react";
import styles from "./CodeEditor.module.css";

export default function CodeEditor({ fileName, onClose }) {
    const [code, setCode] = useState("loading…");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch(`/files/${encodeURIComponent(fileName)}`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch file");
                return res.text();
            })
            .then(setCode)
            .catch(() => setCode("// failed to load file"));
    }, [fileName]);

    const save = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/files/${encodeURIComponent(fileName)}`, {
                method: "PUT",
                headers: { "Content-Type": "text/plain" },
                body: code,
            });
            if (!res.ok) throw new Error("Save failed");
            alert("File saved successfully.");
        } catch (error) {
            console.error(error);
            alert("Failed to save file.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={styles.editorWrapper}>
            <h3 className={styles.title}>{fileName}</h3>
            <div className={styles.codeSnippet}>
                <textarea
                    className={styles.textarea}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    spellCheck={false}
                />
            </div>
            <div className={styles.actions}>
                <button onClick={save} disabled={saving}>
                    {saving ? "Saving…" : "Save"}
                </button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}
