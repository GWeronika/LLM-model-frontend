import styles from './CategorySelector.module.css';

const categories = [
    { name: 'Code Generation', description: 'Generate code from natural language.' },
    { name: 'Code Documentation', description: 'Generate docs and comments.' },
    { name: 'Debugging', description: 'Find and fix bugs.' },
    { name: 'Explaining', description: 'Explain code or logic.' },
];

function CategorySelector({ onSelect }) {
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Choose a category</h2>
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
            </div>
        </div>
    );
}

export default CategorySelector;
