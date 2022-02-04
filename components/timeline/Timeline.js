import Image from "next/image";
import styles from "./Timeline.module.css";

const FRAME_SIZE_MULTIPLIER = 1.875;

const Timeline = ({
  width,
  height,
  frames,
  left,
  right,
  resizable,
  grayscale,
}) => {
  return (
    <div
      className={`${styles.timelineWrapper} ${
        resizable ? styles.resizable : ""
      }`}
      style={resizable ? { left, right } : {}}
    >
      <div
        className={styles.timeline}
        style={
          resizable
            ? { position: "absolute", right: 0, top: 0, left: `-${left}` }
            : {}
        }
      >
        {frames &&
          frames.map((frame, i) => {
            const imageBoxWidth = width / FRAME_SIZE_MULTIPLIER;
            const imageBoxHeight = height / FRAME_SIZE_MULTIPLIER;

            const fullImageWidht = width * (frame.cols / FRAME_SIZE_MULTIPLIER);
            const fullImageHeight =
              height * (frame.rows / FRAME_SIZE_MULTIPLIER);

            const margin = `-${frame.y / FRAME_SIZE_MULTIPLIER}px 0 0 -${
              frame.x / FRAME_SIZE_MULTIPLIER
            }px`;

            return (
              <div
                key={`frame-${i}`}
                style={{
                  width: imageBoxWidth,
                  height: imageBoxHeight,
                  overflow: "hidden",
                }}
              >
                <Image
                  alt="Timeline frame"
                  src={frame.url}
                  style={{
                    width: fullImageWidht,
                    height: fullImageHeight,
                    filter: grayscale ? "grayscale(100%)" : "",
                    margin,
                  }}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Timeline;
