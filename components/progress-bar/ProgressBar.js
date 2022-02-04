import styles from "./ProgressBar.module.css";

const ProgressBar = ({ title, progress }) => {
  return (
    <div className={styles.progressbar}>
      {title}
      <div className={styles.progressbarContainer}>
        <div
          className={styles.progressbarComplete}
          style={{ width: `${progress}%` }}
        >
          <div className={styles.progressbarLiquid}></div>
        </div>
        <span className={styles.progress}>{progress}%</span>
      </div>
    </div>
  );
};

export default ProgressBar;
