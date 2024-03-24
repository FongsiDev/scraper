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

function twitterdl(Url) {
  return new Promise(async (resolve, reject) => {
    try {
      const isUrl = (str) => /^https?:\/\//.test(str);
      if (!isUrl(Url) || !/x\.com|twitter\.com/i.test(Url))
        throw new Error("Invalid URL: " + Url);

      const cookies = await getCookies();

      await axios
        .post(
          "https://anydownloader.com/wp-json/aio-dl/video-data/",
          new URLSearchParams({
            url: Url,
            token: btoa(Date.now()),
          }),
          {
            headers: {
              authority: "anydownloader.com",
              accept: "*/*",
              "accept-language": "ms-MY,ms;q=0.9,en-US;q=0.8,en;q=0.7,id;q=0.6",
              cookie: cookies.join("; "),
              origin: "https://anydownloader.com",
              referer: "https://anydownloader.com/en/twitter-video-downloader",
              "sec-ch-ua": '"Not)A;Brand";v="24", "Chromium";v="116"',
              "sec-ch-ua-mobile": "?1",
              "sec-ch-ua-platform": '"Android"',
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              "user-agent":
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

module.exports = twitterdl;
