const axios = require("axios");
const cheerio = require("cheerio");

function getCSRFCOOKIE() {
  return new Promise((resolve, reject) => {
    axios
      .get("https://en.y2mate.is/v74/")
      .then(({ data, headers }) => {
        const $ = cheerio.load(data);
        const cookiesArray = headers["set-cookie"];
        const csrfToken = $('meta[name="csrf-token"]').attr("content");
        resolve({ csrfToken, cookiesArray });
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
}

function youtubedl(Url) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!global.isUrlFSPR(Url) || !/youtube\.com/i.test(Url))
        return global.rejectFSPR("Invalid URL: " + Url);
      const dataCf = await getCSRFCOOKIE();
      await axios
        .post(
          "https://en.y2mate.is/analyze",
          new URLSearchParams({
            url: Url,
          }),
          {
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded; charset=UTF-8",
              Accept: "application/json, text/javascript, */*; q=0.01",
              cookie: dataCf.cookiesArray.join("; "),
              "X-CSRF-TOKEN": dataCf.csrfToken,
              "X-Requested-With": "XMLHttpRequest",
              "User-Agent":
                "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36",
              Referer: "https://en.y2mate.is/v74/",
            },
          },
        )
        .then(({ data }) => {
          resolve(global.resolveFSPR(data.formats));
        })
        .catch((error) => {
          resolve(global.rejectFSPR(error));
        });
    } catch (error) {
      resolve(global.rejectFSPR(error));
    }
  });
}

module.exports = youtubedl;
