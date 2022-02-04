import { useEffect, useRef } from "react";
import Loading from "../loading/Loading";
import styles from "./VideoPlayer.module.css";

const VideoPlayer = ({ poster, player, currentTime, url, loading }) => {
  const videoRef = useRef();

  useEffect(() => {
    if (videoRef.current && currentTime > 0) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  return (
    <>
      <Loading loading={loading} />
      {!loading && (
        <video
          muted
          preload="auto"
          className={styles.video}
          poster={poster}
          ref={videoRef}
          onClick={() => {
            if (!loading) window.open(url, "_blank");
          }}
        >
          <source src={player} type="video/mp4" />
        </video>
      )}
    </>
  );
};

export default VideoPlayer;
