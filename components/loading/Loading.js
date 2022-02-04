import styles from "./Loading.module.css";

const Loading = ({ loading }) => {
  return (
    <div className={styles.loading} style={{ opacity: loading ? 1 : 0 }}></div>
  );
};

export default Loading;
