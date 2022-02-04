import ytdl from "ytdl-core";

import ffmpeg from "ffmpeg-static";
import cp from "child_process";

export default async function handler(req, res) {
  try {
    const { url, start, end, format } = req.query;

    res.setHeader(
      "Content-Type",
      `${format === "video" ? "video/x-matroska" : "audio/x-mpge3"}`
    );

    let duration = 0,
      mergeAndTrimProgress = 0;

    const video =
      format === "video"
        ? ytdl(url, {
            filter: "videoonly",
            quality: "highestvideo",
          }).on("progress", (_, downloaded, total) => {
            res.write(
              JSON.stringify({
                videoDownloadProgress: Math.min(
                  (
                    (downloaded /
                      (!start || !end
                        ? total
                        : ((end - start) / duration) * total)) *
                    100
                  ).toFixed(2),
                  100
                ),
              }) + "\n"
            );
          })
        : undefined;

    const audio = ytdl(url, {
      filter: "audioonly",
      quality: "highestaudio",
    })
      .on("progress", (_, downloaded, total) => {
        res.write(
          JSON.stringify({
            audioDownloadProgress: Math.min(
              (
                (downloaded /
                  (!start || !end
                    ? total
                    : ((end - start) / duration) * total)) *
                100
              ).toFixed(2),
              100
            ),
          }) + "\n"
        );
      })
      .on("info", (info) => {
        duration = info.videoDetails.lengthSeconds;
      });

    const options = [
      "-loglevel",
      "8",
      "-hide_banner",
      "-progress",
      "pipe:3",
      "-i",
      "pipe:4",
      `${format === "video" ? "-i" : ""}`,
      `${format === "video" ? "pipe:5" : ""}`,
      "-map",
      "0:a",
      "-b:a",
      "192k",
      `${format === "video" ? "-map" : ""}`,
      `${format === "video" ? "1:v" : ""}`,
      `${!start || !end ? "-c:v" : ""}`,
      `${!start || !end ? "copy" : ""}`,
      "-f",
      `${format === "video" ? "matroska" : "mp3"}`,
      `${!start || !end ? "" : "-ss"}`,
      `${!start || !end ? "" : start}`,
      `${!start || !end ? "" : "-t"}`,
      `${!start || !end ? "" : end - start}`,
      "pipe:6",
    ].filter((o) => o !== "");

    const mergeAndTrim = cp.spawn(ffmpeg, options, {
      stdio: ["inherit", "inherit", "inherit", "pipe", "pipe", "pipe", "pipe"],
    });

    mergeAndTrim.stdio[3].on("data", (chunk) => {
      const lines = chunk.toString().trim().split("\n");
      const args = {};
      for (const l of lines) {
        const [key, value] = l.split("=");
        args[key.trim()] = value.trim();
      }

      const elapsedTime = Math.floor(args.out_time_us / 1000000);
      mergeAndTrimProgress = Math.min(
        (
          (elapsedTime / (!start || !end ? duration : end - start)) *
          100
        ).toFixed(2),
        100
      );
    });

    mergeAndTrim.stdio[4].on("error", (err) => {});
    mergeAndTrim.stdio[5].on("error", (err) => {});

    mergeAndTrim.stdio[6].on("data", (chunk) => {
      res.write(JSON.stringify({ mergeAndTrimProgress, chunk }) + "\n");
    });

    audio.pipe(mergeAndTrim.stdio[4]);
    if (format === "video") video.pipe(mergeAndTrim.stdio[5]);

    mergeAndTrim.on("exit", () => {
      console.log("merge finished!");
      res.end();
      return;
    });
  } catch (error) {
    return res.status(500).send(error);
  }
}
