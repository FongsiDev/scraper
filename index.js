const TiktokDownloader = require("./lib/Tiktok-Downloader.js");
const InstagramDownloader = require("./lib/Instagram-Downloader.js");
const CapcutDownloader = require("./lib/Capcut-Downloader.js");
const DriveDownloader = require("./lib/Drive-Downloader.js");
const MediaFireDownloader = require("./lib/MediaFire-Downloader.js");
const FacebookDownloader = require("./lib/Facebook-Downloader.js");
const TwitterDownloader = require("./lib/Twitter-Downloader.js");
const SpotifyDownloader = require("./lib/Spotify-Downloader.js");
const PinterestDownloader = require("./lib/Pinterest-Downloader.js");
const YouTubeDownloader = require("./lib/YouTube-Downloader/Down.js");
const YouTubeScraper = require("./lib/YouTube-Downloader/Scraper.js");

function downloadTiktokVideo(url) {
  return new Promise((resolve, reject) => {
    TiktokDownloader.tikVideo(url).then(resolve).catch(reject);
  });
}

function downloadTiktokUser(url) {
  return new Promise((resolve, reject) => {
    TiktokDownloader.tikUser(url).then(resolve).catch(reject);
  });
}

function downloadYouTubeSearch(...q) {
  return new Promise((resolve, reject) => {
    new YouTubeScraper()
      .search(...q)
      .then(resolve)
      .catch(reject);
  });
}

function downloadYouTube(...args) {
  return new Promise((resolve, reject) => {
    YouTubeDownloader.ytdl(...args)
      .then(resolve)
      .catch(reject);
  });
}

function downloadByService(url) {
  return new Promise(async (resolve, reject) => {
    if (url.match(/tiktok/i)) {
      resolve({
        type: "tiktok",
        ...(await downloadTiktokVideo(url)),
      });
    } else if (url.match(/instagram/i)) {
      resolve({
        type: "instagram",
        ...(await InstagramDownloader(url)),
      });
    } else if (url.match(/capcut/i)) {
      resolve({
        type: "capcut",
        ...(await CapcutDownloader(url)),
      });
    } else if (url.match(/drive\.google\.com/i)) {
      resolve({
        type: "drive",
        ...(await DriveDownloader(url)),
      });
    } else if (url.match(/mediafire/i)) {
      resolve({
        type: "mediafire",
        ...(await MediaFireDownloader(url)),
      });
    } else if (url.match(/facebook/i)) {
      resolve({
        type: "facebook",
        ...(await FacebookDownloader(url)),
      });
    } else if (url.match(/twitter/i)) {
      resolve({
        type: "twitter",
        ...(await TwitterDownloader(url)),
      });
    } else if (url.match(/spotify/i)) {
      resolve({
        type: "spotify",
        ...(await SpotifyDownloader(url)),
      });
    } else if (url.match(/pinterest/i)) {
      resolve({
        type: "pinterest",
        ...(await PinterestDownloader(url)),
      });
    } else if (url.match(/youtube\.com/i)) {
      resolve({
        type: "youtube",
        ...(await downloadYouTube(url)),
      });
    } else {
      reject({
        status: 401,
        msg: "Unsupported service or invalid URL",
      });
    }
  });
}

module.exports = {
  TiktokVideo: downloadTiktokVideo,
  TiktokUser: downloadTiktokUser,
  Instagram: InstagramDownloader,
  Capcut: CapcutDownloader,
  Drive: DriveDownloader,
  MediaFire: MediaFireDownloader,
  Facebook: FacebookDownloader,
  Twitter: TwitterDownloader,
  Spotify: SpotifyDownloader,
  Pinterest: PinterestDownloader,
  YouTube: {
    search: downloadYouTubeSearch,
    down: downloadYouTube,
  },
  AutoDL: downloadByService,
};
