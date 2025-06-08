import styles from './CategorySelector.module.css';

const categories = [
    { name: 'chat', description: 'Selects category based on user question.' },
    { name: 'utility', description: 'General code generation.' },
    { name: 'test', description: 'Generates tests.' },
    { name: 'debug', description: 'Debugging code' },
    { name: 'data', description: 'Data processing.' },
    { name: 'api', description: 'API connections.' },
    { name: 'ui', description: 'UI elements.' },
    { name: 'event', description: 'Event handling logic.' },
    { name: 'acces', description: 'Database acces queries.' },
    { name: 'options', description: 'Allows reading from database and SET method.' }
];

function CategorySelector({ onSelect, onCancel }) {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Choose a category</h2>
            </div>
            <div className={styles.grid}>
                {categories.map((cat) => (
                    <div
                        key={cat.name}
                        className={styles.card}
                        onClick={() => onSelect(cat.name)}
                    >
                        <h3>{cat.name}</h3>
                        <p>{cat.description}</p>
                    </div>
                ))}
                <button className={styles.cancelButton} onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
}

export default CategorySelector;
