import { useEffect, useRef, useState } from "react";
import ReactSlider from "react-slider";
import styles from "./Input.module.css";

const useCompoundSlider = (max, handleLeft, handleRight) => {
  const trackRef = useRef();

  useEffect(() => {
    if (trackRef.current) {
      handleLeft(trackRef.current.style.left);
      handleRight(trackRef.current.style.right);
    }
  });

  const [value, setValue] = useState([0, max ?? 0]);

  useEffect(() => {
    if (max === 0 || max === undefined) setValue([0, 0]);
    else setValue([0, max]);
  }, [max]);

  const format = (value) => {
    if (value === 0) return "00:00";

    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value - hours * 3600) / 60);
    const seconds = value - hours * 3600 - minutes * 60;

    return (
      `${hours > 0 ? hours + ":" : ""}` +
      `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    );
  };

  const slider = (
    <div className={styles.compoundSlider}>
      <ReactSlider
        className={styles.horizontalSlider}
        thumbClassName={styles.exampleThumb}
        value={value}
        min={0}
        max={max}
        pearling
        minDistance={15}
        renderThumb={(props, state) => (
          <div {...props}>
            <div className={styles.thumbTooltip}>
              {format(value[state.index])}
            </div>
          </div>
        )}
        renderTrack={(props, state) => {
          if (state.index === 1)
            return (
              <div {...props} ref={trackRef} className={styles.visibleTrack} />
            );
        }}
        onChange={(e) => setValue(e)}
      />
    </div>
  );

  return [value, slider];
};

export default useCompoundSlider;
