module.exports = {
  TiktokVideo: require("./lib/Tiktok-Downloader.js").tikVideo,
  TiktokUser: require("./lib/Tiktok-Downloader.js").tikUser,
  Instagram: require("./lib/Instagram-Downloader.js"),
  Capcut: require("./lib/Capcut-Downloader.js"),
  Drive: require("./lib/Drive-Downloader.js"),
  MediaFire: require("./lib/MediaFire-Downloader.js"),
  Facebook: require("./lib/Facebook-Downloader.js"),
  Twitter: require("./lib/Twitter-Downloader.js"),
  Spotify: require("./lib/Spotify-Downloader.js"),
  Pinterest: require("./lib/Pinterest-Downloader.js"),
  YouTube: {
    search: (...q) => {
      return new (require("./lib/YouTube-Downloader/Scraper.js"))().search(
        ...q,
      );
    },
    ...require("./lib/YouTube-Downloader/Down.js"),
  },
};
