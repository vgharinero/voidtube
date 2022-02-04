import { useEffect, useState } from "react";
import useCompoundSlider from "../../hooks/useCompoundSlider";
import Timeline from "../timeline/Timeline";
import VideoPlayer from "../video-player/VideoPlayer";

const PreviewEditor = ({ video, handleRange, loading }) => {
  const [currentTime, setCurrentTime] = useState(0);

  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);

  const [range, slider] = useCompoundSlider(
    video.videoDuration,
    setLeft,
    setRight
  );

  useEffect(() => {
    if (left !== "0px") setCurrentTime(range[0]);
  }, [left]);

  useEffect(() => {
    if (right !== "0px") setCurrentTime(range[1]);
  }, [right]);

  useEffect(() => {
    handleRange(range);
  }, [range]);

  const timeline = (grayscale, resizable) => (
    <Timeline
      width={video.storyboard?.width}
      height={video.storyboard?.height}
      frames={video.storyboard?.frames}
      left={left}
      right={right}
      resizable={resizable}
      grayscale={grayscale}
    />
  );

  return (
    <div className="main-content">
      <VideoPlayer
        poster={video.videoThumbnail}
        player={video.videoPlayer}
        currentTime={currentTime}
        url={video.videoURL}
        loading={loading}
      />
      {!loading && (
        <>
          {slider}
          {timeline(false, true)}
          {timeline(true, false)}
        </>
      )}
    </div>
  );
};

export default PreviewEditor;
