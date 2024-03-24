const got = require("got");
const cheerio = require("cheerio");

const mediafiredl = (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isUrl = (str) => /^https?:\/\//.test(str);
      if (!isUrl(url) || !/mediafire\.com/i.test(url))
        throw new Error("Invalid URL: " + url);

      const data = await got(url).text();
      const $ = cheerio.load(data);
      const Url = ($("#downloadButton").attr("href") || "").trim();
      const url2 = ($("#download_link > a.retry").attr("href") || "").trim();
      const $intro = $("div.dl-info > div.intro");
      const filename = $intro.find("div.filename").text().trim();
      const filetype = $intro.find("div.filetype > span").eq(0).text().trim();
      const ext =
        /\(\.(.*?)\)/
          .exec($intro.find("div.filetype > span").eq(1).text())?.[1]
          ?.trim() || "bin";
      const $li = $("div.dl-info > ul.details > li");
      const aploud = $li.eq(1).find("span").text().trim();
      const filesizeH = $li.eq(0).find("span").text().trim();
      const filesize = parseFileSize(filesizeH);

      const result = {
        status: 200,
        url: Url || url2,
        filename,
        filetype,
        ext,
        aploud,
        filesizeH,
        filesize,
      };

      resolve(result);
    } catch (error) {
      resolve({
        status: 404,
        msg: error?.message || error,
      });
    }
  });
};

function parseFileSize(size) {
  return (
    parseFloat(size) *
    (/GB/i.test(size)
      ? 1000000
      : /MB/i.test(size)
        ? 1000
        : /KB/i.test(size)
          ? 1
          : /bytes?/i.test(size)
            ? 0.001
            : /B/i.test(size)
              ? 0.1
              : 0)
  );
}

module.exports = mediafiredl;
