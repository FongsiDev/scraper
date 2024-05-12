const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");

async function sfileSearch(query, page = 1) {
  let res = await fetch(
    `https://sfile.mobi/search.php?q=${query}&page=${page}`,
  );
  let $ = cheerio.load(await res.text());
  let result = [];
  $("div.list").each(function () {
    let title = $(this).find("a").text();
    let size = $(this).text().trim().split("(")[1];
    let link = $(this).find("a").attr("href");
    if (link) result.push({ title, size: size.replace(")", ""), link });
  });
  return result;
}

async function sfileDl(url) {
  let res = await fetch(url);
  let $ = cheerio.load(await res.text());
  let filename = $("div.w3-row-padding").find("img").attr("alt");
  let mimetype = $("div.list").text().split(" - ")[1].split("\n")[0];
  let filesize = $("#download")
    .text()
    .replace(/Download File/g, "")
    .replace(/\(|\)/g, "")
    .trim();
  let download =
    $("#download").attr("href") +
    "&k=" +
    Math.floor(Math.random() * (15 - 10 + 1) + 10);
  return { filename, filesize, mimetype, download };
}

function sfiledl(Url) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!global.isUrlFSPR(Url) || !/sfile\.mobi/i.test(Url))
        return global.rejectFSPR("Invalid URL: " + Url);

      await axios
        .get(Url, {
          headers: {
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
          let $ = cheerio.load(data);
          let filename = $("img.intro").attr("alt");
          let mimetype = $("div.list").text().split(" - ")[1].split("\n")[0];
          let filesize =
            $("#download")
              .text()
              .replace(/Download File/g, "")
              .replace(/\(|\)/g, "")
              .trim() || 0;
          let download =
            $("#download").attr("href") +
            "&k=" +
            Math.floor(Math.random() * (15 - 10 + 1) + 10);

          resolve(
            global.resolveFSPR({
              filename,
              filesize,
              mimetype,
              download,
            }),
          );
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

module.exports = sfiledl;
