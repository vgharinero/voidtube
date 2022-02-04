import CheckIcon from "../../resources/icons/CheckIcon";
import ProgressBar from "../progress-bar/ProgressBar";
import styles from "./Done.module.css";

const Done = ({ downloading, progress }) => {
  return (
    <div className="main-content">
      {downloading ? (
        <>
          {progress.videoDownloadProgress && (
            <ProgressBar
              title="Video download"
              progress={progress.videoDownloadProgress}
            />
          )}
          {progress.audioDownloadProgress && (
            <ProgressBar
              title="Audio download"
              progress={progress.audioDownloadProgress}
            />
          )}
          {progress.mergeAndTrimProgress && (
            <ProgressBar
              title="Processing"
              progress={progress.mergeAndTrimProgress}
            />
          )}
        </>
      ) : (
        <div className={styles.done}>
          <CheckIcon />
          Your video is already downloading
        </div>
      )}
    </div>
  );
};

export default Done;
