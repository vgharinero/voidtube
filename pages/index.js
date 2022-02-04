import { useEffect, useState } from "react";
import DownloadFrame from "../components/download-frame/DownloadFrame";
import Logo from "../components/logo/Logo";
import SearchBar from "../components/search/SearchBar";
import PreviewEditor from "../components/preview-editor/PreviewEditor";
import Done from "../components/done/Done";
import Head from "next/head";

const Index = () => {
  const [state, setState] = useState("default");
  const [video, setVideo] = useState({});

  const [searching, setSearching] = useState(true);

  const [finished, setFinished] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState({});

  const [opacity, setOpacity] = useState(0);

  const [range, setRange] = useState([]);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (downloading) setFinished(true);
  }, [downloading]);

  useEffect(() => {
    if (range.length > 0 && range[0] === 0 && range[1] === duration)
      setRange([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  const handleSearch = (searchTerm) => {
    setSearching(true);

    if (finished) {
      setFinished(false);
      setProgress({});
    }

    if (searchTerm === "") {
      setVideo({});
      setState("default");
      setOpacity(0);
      return;
    }

    setState("searching");

    setTimeout(() => {
      setOpacity(1);
    }, 350);

    fetch(`api/search?term=${searchTerm}`)
      .then((response) => response.json())
      .then((result) => {
        setDuration(result.videoDuration);
        setVideo(result);
        setSearching(false);
      });
  };

  return (
    <main className="app">
      <Head>
        <title>Voidtube</title>
      </Head>
      <Logo state={state} />
      <section className="content">
        <SearchBar
          handleInput={() => setSearching(true)}
          handleSearch={handleSearch}
        />
        <div
          className="searching-content"
          style={{
            maxHeight: state === "searching" ? "100vh" : 0,
            opacity,
          }}
        >
          {finished ? (
            <Done downloading={downloading} progress={progress} />
          ) : (
            <PreviewEditor
              video={video}
              handleRange={setRange}
              loading={searching}
            />
          )}
          <DownloadFrame
            title={video.title}
            url={video.videoURL}
            range={range}
            handleDownloading={setDownloading}
            handleProgress={(newProgress) =>
              setProgress((progress) => ({ ...progress, ...newProgress }))
            }
            finished={finished}
          />
        </div>
      </section>
    </main>
  );
};

export default Index;
