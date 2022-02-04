import { useEffect, useState } from "react";
import styles from "./Logo.module.css";

const DEFAULT_CENTERED_LOGO_MARGIN_BOTTOM = 286;
const DEFAULT_LEFT_LOGO_TOP = 32;
const HIDDEN_CENTERED_LOGO_MARGIN_BOTTOM = 1300;
const HIDDEN_LEFT_LOGO_TOP = -120;

const Logo = ({ state }) => {
  const [marginBottom, setMarginBottom] = useState(
    DEFAULT_CENTERED_LOGO_MARGIN_BOTTOM
  );
  const [top, setTop] = useState(HIDDEN_LEFT_LOGO_TOP);

  const centeredLogo = (
    <header
      className={`${styles.logo} ${styles.centered}`}
      style={{ marginBottom: `${marginBottom}px` }}
    >
      <div className={styles.centeredh1}>
        <span>void</span>
        <span>tube</span>
      </div>
      <div className={styles.centeredh2}>
        easily get your favourite videos in mp3 or mp4 👌
      </div>
    </header>
  );

  const leftLogo = (
    <header
      className={`${styles.logo} ${styles.left}`}
      style={{ top: `${top}px` }}
    >
      <div className={styles.lefth1}>
        <span>void</span>
        <span>tube</span>
      </div>
    </header>
  );

  useEffect(() => {
    if (state === "default") {
      setMarginBottom(DEFAULT_CENTERED_LOGO_MARGIN_BOTTOM);
      setTop(HIDDEN_LEFT_LOGO_TOP);
    } else {
      setMarginBottom(HIDDEN_CENTERED_LOGO_MARGIN_BOTTOM);
      setTop(DEFAULT_LEFT_LOGO_TOP);
    }
  }, [state]);

  return (
    <>
      {leftLogo}
      {centeredLogo}
    </>
  );
};

export default Logo;
