const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");

const instagramDl = (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!global.isUrlFSPR(url) || !/instagram\.com/i.test(url))
        return global.rejectFSPR("Invalid URL: " + url);

      const apiUrl = "https://v3.saveig.app/api/ajaxSearch";
      const params = {
        q: url,
        t: "media",
        lang: "en",
      };

      const headers = {
        Accept: "*/*",
        Origin: "https://saveig.app",
        Referer: "https://saveig.app/en",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9",
        "Content-Type": "application/x-www-form-urlencoded",
        "Sec-Ch-Ua":
          '"Not/A)Brand";v="99", "Microsoft Edge";v="115", "Chromium";v="115"',
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": '"Windows"',
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.183",
        "X-Requested-With": "XMLHttpRequest",
      };

      const config = {
        headers,
      };

      const response = await axios.post(apiUrl, qs.stringify(params), config);
      const responseData = response.data.data;
      const $ = cheerio.load(responseData);

      const downloadItems = $(".download-items");
      const result = [];

      downloadItems.each((index, element) => {
        const thumbnailLink = $(element)
          .find(".download-items__thumb > img")
          .attr("src");
        const downloadLink = $(element)
          .find(".download-items__btn > a")
          .attr("href");

        result.push({
          thumbnail_link: thumbnailLink,
          download_link: downloadLink,
        });
      });

      resolve(global.resolveFSPR(result));
    } catch (error) {
      resolve(global.rejectFSPR(error));
    }
  });
};

async function instagramDl2(url) {
  try {
    if (!global.isUrlFSPR(url) || !/instagram\.com/i.test(url))
      return global.rejectFSPR("Invalid URL: " + url);
    return axios(
      `https://fongsi-scraper-rest-api.vercel.app/ig?url=${url}`,
    ).then(({ data }) => {
      if(!data.status) return global.rejectFSPR(data.message);
      return global.resolveFSPR(data.data);
    });
  } catch (error) {
    return global.rejectFSPR(error);
  }
}

module.exports = instagramDl2;
