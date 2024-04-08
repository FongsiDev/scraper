/* IDK :) */

global.APIsFSPR = {};
global.APIFSPR = (name, path = "/", query = {}, apikeyqueryname) =>
  (name in global.APIsFSPR ? global.APIsFSPR[name] : name) +
  path +
  (query || apikeyqueryname
    ? "?" +
      new URLSearchParams(
        Object.entries({
          ...query,
          ...(apikeyqueryname
            ? {
                [apikeyqueryname]:
                  global.APIsFSPR[
                    name in global.APIsFSPR ? global.APIsFSPR[name] : name
                  ],
              }
            : {}),
        }),
      )
    : "");

/* DOWNLOADER */
const TiktokDownloader = require("./lib/Downloaders/Tiktok-Downloader.js");
const InstagramDownloader = require("./lib/Downloaders/Instagram-Downloader.js");
const CapcutDownloader = require("./lib/Downloaders/Capcut-Downloader.js");
const DriveDownloader = require("./lib/Downloaders/Drive-Downloader.js");
const MediaFireDownloader = require("./lib/Downloaders/MediaFire-Downloader.js");
const FacebookDownloader = require("./lib/Downloaders/Facebook-Downloader.js");
const TwitterDownloader = require("./lib/Downloaders/Twitter-Downloader.js");
const SpotifyDownloader = require("./lib/Downloaders/Spotify-Downloader.js");
const PinterestDownloader = require("./lib/Downloaders/Pinterest-Downloader.js");
const YouTubeDownloader = require("./lib/Downloaders/YouTube-Downloader/Down.js");
const YouTubeScraper = require("./lib/Downloaders/YouTube-Downloader/Scraper.js");
const SfileDownloader = require("./lib/Downloaders/Sfile-Downloader.js");

/* AI */
const GGemini = require("./lib/AI/G-Gemini.js");
const FAIIGGTranslate = require("./lib/AI/FAIIGG-Translate.js");

/* TOOLS */
const ToolGtts = require("./lib/Tools/Gtts.js");
const ToolTranslator = require("./lib/Tools/Translator.js");
const ToolGLens = require("./lib/Tools/GoogleLens.js");

/* SHORT URL */
const Short1 = require("./lib/Shorts/Shorter.Me.js");

/* FUNCTIONS */
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

/* AUTO DOWNLOADER BY URL */
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
    } else if (url.match(/sfile\.mobi/i)) {
      resolve({
        type: "sfile",
        ...(await SfileDownloader(url)),
      });
    } else {
      reject({
        status: 401,
        msg: "Unsupported service or invalid URL",
      });
    }
  });
}

/* IMPORT ALL */

module.exports = {
  /* DOWNLOADER */
  AutoDL: downloadByService,
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
  Sfile: SfileDownloader,
  YouTube: {
    search: downloadYouTubeSearch,
    down: downloadYouTube,
  },
  /* AI */
  GGemini, //Not yet fixed
  FAIIGGTranslate,
  /* TOOLS */
  Gtts: ToolGtts,
  Translator: ToolTranslator,
  GoogleLens: ToolGLens,
  /* SHORT URL */
  Short1,
};
