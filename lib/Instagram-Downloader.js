const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");

const instagramDl = (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isUrl = (str) => /^https?:\/\//.test(str);
      if (!isUrl(url) || !/instragram\.com/i.test(url))
        throw new Error("Invalid URL: " + url);

      const apiUrl = "https://saveig.app/api/ajaxSearch";
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

      resolve({
        status: 200,
        ...result,
      });
    } catch (error) {
      resolve({
        status: 404,
        msg: error?.message || error,
      });
    }
  });
};

module.exports = instagramDl;
