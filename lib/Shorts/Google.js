const axios = require("axios");

function getUrlFromData(data) {
  try {
    // Menggunakan regular expression untuk mengekstrak URL dari data
    const match = data.match(/https:\/\/[^"]+/);
    if (match) {
      return match[0]; // Mengembalikan URL yang cocok
    } else {
      throw new Error("URL not found in data");
    }
  } catch (error) {
    console.error("Error extracting URL from data:", error);
    return null;
  }
}

function Short2(url) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        "https://www.google.com/_/VisualFrontendUi/data/batchexecute",
        new URLSearchParams({
          "f.req": `[[["nR9Pkb","[\\"https://www.google.com/imgres?imgurl=${url}\\"]",null,"generic"]]]`,
        }),
        {
          params: {
            rpcids: "nR9Pkb",
            "source-path": "/search",
            bl: "boq_visualfrontendserver_20240426.06_p0",
            hl: "ms",
            "soc-app": "162",
            "soc-platform": "1",
            "soc-device": "2",
            authuser: "0",
            opi: "89978449",
            _reqid: "451688",
            rt: "c",
          },
          headers: {
            "X-Same-Domain": "1",
            "x-goog-ext-487613250-jspb": "[1]",
            "x-goog-ext-525000360-jspb": '[""]',
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            "User-Agent":
              "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36",
            Referer: "https://www.google.com/search",
          },
        },
      )
      .then(({ data }) => {
        console.log(data);
        //resolve({ status: 200, url: getUrlFromData(data) });
      })
      .catch((error) => {
        resolve({ status: 404, msg: error?.message || error });
      });
  });
}

module.exports = Short2;
