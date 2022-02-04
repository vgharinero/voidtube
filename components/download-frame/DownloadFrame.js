import AudioIcon from "../../resources/icons/AudioIcon";
import VideoIcon from "../../resources/icons/VideoIcon";
import styles from "./DownloadFrame.module.css";
import { useEffect, useRef, useState } from "react";
import ndjsonStream from "can-ndjson-stream";

const DownloadFrame = ({
  title,
  url,
  range,
  handleDownloading,
  handleProgress,
  finished,
}) => {
  const downloadRef = useRef();

  const [format, setFormat] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    handleDownloading(downloading);
  }, [downloading, handleDownloading]);

  const downloadVideo = (format) => {
    setFormat(format);
    setDownloading(true);

    fetch(
      `api/download?url=${url}&format=${format}${
        range.length > 0 ? `&start=${range[0]}&end=${range[1]}` : ""
      }`
    )
      .then(async (response) => {
        const headers = response.headers;
        const reader = ndjsonStream(response.body).getReader();
        const parts = [];
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          if (value.chunk) {
            parts.push(new Uint8Array(value.chunk.data));
            // console.log(
            //   (parts.reduce((acc, cur) => acc + cur.length, 0) / 1024).toFixed(
            //     2
            //   ) + "KB"
            // );
          }
          if ("mergeAndTrimProgress" in value)
            handleProgress({
              mergeAndTrimProgress: value.mergeAndTrimProgress,
            });
          if ("videoDownloadProgress" in value)
            handleProgress({
              videoDownloadProgress: value.videoDownloadProgress,
            });
          if ("audioDownloadProgress" in value)
            handleProgress({
              audioDownloadProgress: value.audioDownloadProgress,
            });
        }
        return new Blob(parts, { type: headers.get("Content-Type") });
      })
      .then((blob) => {
        const href = window.URL.createObjectURL(blob);
        const downloadHTML = downloadRef.current;
        downloadHTML.download = `${title}.${
          format === "video" ? "mkv" : "mp3"
        }`;
        downloadHTML.href = href;
        downloadHTML.click();
        downloadHTML.download = "";
        downloadHTML.href = "";
        setDownloading(false);
      });
  };

  return (
    <>
      <a
        ref={downloadRef}
        href={process.env.REACT_APP_VOIDTUBE_API_BASE_URL}
        hidden
      >
        Download anchor element
      </a>
      <div className={styles.downloadFrame}>
        {finished ? (
          !downloading && (
            <div className={styles.downloadTryAgain}>
              Your file isn't downloading?
              <span
                className={styles.downloadTryAgainButton}
                onClick={() => downloadVideo(format)}
              >
                Try again
              </span>
            </div>
          )
        ) : (
          <>
            <button
              className={styles.downloadButton}
              onClick={() => downloadVideo("audio")}
            >
              <AudioIcon color="#fff" />
              Download audio (mp3)
            </button>
            <button
              className={styles.downloadButton}
              onClick={() => downloadVideo("video")}
            >
              <VideoIcon color="#fff" />
              Download video (mp4)
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default DownloadFrame;
