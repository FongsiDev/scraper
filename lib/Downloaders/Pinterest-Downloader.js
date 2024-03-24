const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");
const domain = "https://ssscapcut.com/";

// capcut new
function getCookies() {
  return new Promise((resolve, reject) => {
    axios
      .get("https://getindevice.com/pinterest-video-downloader/")
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

function pinterestdl(Url) {
  return new Promise(async (resolve, reject) => {
    try {
      const isUrl = (str) => /^https?:\/\//.test(str);
      if (!isUrl(Url) || !/pinterest\.com|pin\.it/i.test(Url))
        throw new Error("Invalid URL: " + Url);

      const cookies = await getCookies();

      await axios
        .post(
          "https://getindevice.com/wp-json/aio-dl/video-data/",
          new URLSearchParams({
            url: Url,
            token: btoa(Date.now()),
          }),
          {
            headers: {
              "sec-ch-ua": '"Not)A;Brand";v="24", "Chromium";v="116"',
              "sec-ch-ua-platform": '"Android"',
              Referer: "https://getindevice.com/pinterest-video-downloader/",
              "sec-ch-ua-mobile": "?1",
              "User-Agent":
                "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
            },
          },
        )
        .then(({ data }) => {
          resolve({
            status: 200,
            ...data,
          });
        })
        .catch((error) => {
          resolve({
            status: 404,
            msg: error?.message || error,
          });
        });
    } catch (error) {
      resolve({
        status: 404,
        msg: error?.message || error,
      });
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

module.exports = pinterestdl;
