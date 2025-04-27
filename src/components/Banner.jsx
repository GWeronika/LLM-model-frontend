import styles from './Banner.module.css';

function Banner() {
    return (
        <div className={styles.banner}>
            <i className={`fa-solid fa-message ${styles.icon}`}></i> {/* dodajemy styles.icon */}
            <h1 className={styles.title}>Your LLM</h1>
        </div>
    );
}

export default Banner;
