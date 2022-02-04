import ytdl from "ytdl-core";
import { youtube } from "scrape-youtube";

export default async function handler(req, res) {
  try {
    const searchResults = await youtube.search(req.query.term);

    let videoFound = searchResults.videos[0];

    if (videoFound === undefined) {
      res.status(404).send("No video found");
      return;
    }

    if (videoFound.uploaded === "") {
      for (video of searchResults.videos) {
        if (video.uploaded !== "") {
          videoFound = video;
          break;
        }
      }
    }

    if (videoFound.uploaded === "") {
      res.status(404).send("No video found");
      return;
    }

    const title = videoFound.title;
    const videoURL = videoFound.link;
    const videoDuration = videoFound.duration;

    const videoInfo = await ytdl.getInfo(videoURL);

    const videoThumbnail =
      videoInfo.videoDetails.thumbnails[
        videoInfo.videoDetails.thumbnails.length - 1
      ].url;

    const videoPlayer = ytdl.filterFormats(videoInfo.formats, (format) => {
      return !format.hasAudio && format.height < 720;
    })[0].url;

    const {
      templateUrl,
      thumbnailCount,
      storyboardCount,
      thumbnailHeight,
      thumbnailWidth,
    } = videoInfo.videoDetails.storyboards[2];

    const frames = [...Array(10)].map((e, i) => {
      const arrayIndex = i * Math.floor(thumbnailCount / 10);

      const storyboardIndex = Math.floor(arrayIndex / 25);
      const url = templateUrl.replace("$M", storyboardIndex);

      const thumbnailIndex = arrayIndex - storyboardIndex * 25;

      const x = (thumbnailIndex % 5) * thumbnailWidth;
      const y = Math.floor(thumbnailIndex / 5) * thumbnailHeight;

      let rows = 5;
      if (i === 9 && storyboardIndex === storyboardCount - 1) {
        const thumbnailsInLastStoryboard =
          thumbnailCount - storyboardIndex * 25;
        if (thumbnailsInLastStoryboard < 25)
          rows = Math.floor(thumbnailsInLastStoryboard / 5) + 1;
      }

      return { url, x, y, cols: 5, rows };
    });

    res.send({
      title,
      videoDuration,
      videoURL,
      videoThumbnail,
      videoPlayer,
      storyboard: {
        width: thumbnailWidth,
        height: thumbnailHeight,
        frames,
      },
    });
  } catch (error) {
    return res.status(500).send(error);
  }
}
