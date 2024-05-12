const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");
const domain = "https://ssscapcut.com/";

// capcut new
function getCookies() {
  return new Promise((resolve, reject) => {
    axios
      .get("https://anydownloader.com/en/twitter-video-downloader")
      .then((response) => {
        const cookiesArray = response.headers["set-cookie"];
        resolve(cookiesArray);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
}
function getSpotifyTrackId(url) {
  const regex = /\/track\/(\w+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function spotifydl(Url) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!global.isUrlFSPR(Url) || !/open\.spotify\.com/i.test(Url))
        return global.rejectFSPR("Invalid URL: " + Url);
      await axios
        .get(
          "https://spotidown.com/wp-json/spotify-downloader/v1/download",
          {
            params: {
              api_request_path: "tracks/",
              item_id: getSpotifyTrackId(Url),
            },
          },
          {
            headers: {
              Accept: "application/json, text/javascript, */*; q=0.01",
              "X-Requested-With": "XMLHttpRequest",
              "User-Agent":
                "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36",
              Referer: "https://spotidown.com/",
            },
          },
        )
        .then(({ data }) => {
          resolve(global.resolveFSPR(data));
        })
        .catch((error) => {
          resolve(global.rejectFSPR(error));
        });
    } catch (error) {
      resolve(global.rejectFSPR(error));
    }
  });
}

function updateUrls(obj) {
  const regex =
    /("originalVideoUrl": "| "authorUrl": "|"coverUrl": ")(\/[^"]+)/g;
  const updatedData = JSON.stringify(obj, null, 2).replace(
    regex,
    (match, p1, p2) => p1 + domain + p2,
  );
  return JSON.parse(updatedData);
}

module.exports = spotifydl;
