const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");
const domain = "https://ssscapcut.com/";

// capcut new
function getCookies() {
  return new Promise((resolve, reject) => {
    axios
      .get("https://ssscapcut.com/")
      .then((response) => {
        const cookiesArray = response.headers["set-cookie"];
        const cookies = cookiesArray.map((cookie) => cookie.split(";")[0]); // Ambil hanya bagian yang diperlukan
        resolve(cookies);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
}

const getOriginalUrl = async (shortUrl) => {
  try {
    const response = await axios.get(shortUrl, {
      maxRedirects: 0,
      validateStatus: null,
    });
    const originalUrl = response.headers.location;
    return originalUrl;
  } catch (error) {
    return shortUrl;
  }
};

function capcutdl(Url) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!global.isUrlFSPR(Url) || !/capcut\.com/i.test(Url))
        return global.rejectFSPR("Invalid URL: " + Url);

      const cookies = await getCookies();
      Url = await getOriginalUrl(Url);
      const token = Url.match(/\d+/)[0];

      await axios
        .get(`https://ssscap.net/api/download/${token}`, {
          headers: {
            authority: "ssscap.net",
            accept: "application/json, text/plain, */*",
            "accept-language": "ms-MY,ms;q=0.9,en-US;q=0.8,en;q=0.7,id;q=0.6",
            cookie: cookies.join("; "),
            referer: "https://ssscap.net/",
            "sec-ch-ua": '"Not)A;Brand";v="24", "Chromium";v="116"',
            "sec-ch-ua-mobile": "?1",
            "sec-ch-ua-platform": '"Android"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent":
              "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
          },
        })
        .then(({ data }) => {
          resolve(global.resolveFSPR(updateUrls(data)));
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

module.exports = capcutdl;
