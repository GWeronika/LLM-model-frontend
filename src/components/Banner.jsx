import styles from './Banner.module.css';

function Banner() {
    return (
        <div className={styles.banner}>
            <h1 className={styles.title}>Your LLM</h1>
        </div>
    );
}

export default Banner;
