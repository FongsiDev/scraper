const axios = require("axios");

function Short1(url) {
  return new Promise((resolve, reject) => {
    if (!global.isUrlFSPR(url)) return global.rejectFSPR("Invalid URL: " + url);
    axios
      .post(
        "https://shorter.me/page/shorten",
        new URLSearchParams({
          url: url,
          alias: "",
          password: "",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            Accept: "*/*",
            "X-Requested-With": "XMLHttpRequest",
            "User-Agent":
              "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36",
            Referer: "https://shorter.me/",
          },
        },
      )
      .then(({ data }) => {
        resolve(global.resolveFSPR(data.data));
      })
      .catch((error) => {
        resolve(global.rejectFSPR(error));
      });
  });
}

module.exports = Short1;
