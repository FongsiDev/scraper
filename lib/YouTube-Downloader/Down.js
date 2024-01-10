const got = require("got");
const { sizeFormatter } = require("human-readable");
const axios = require("axios");
const ytdl = require('ytdl-core');

const toFormat = sizeFormatter({
  std: "JEDEC", // 'SI' (default) | 'IEC' | 'JEDEC'
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}`,
});

const servers = ["en", "id", "es"];
const ytIdRegex =
  /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:shorts\/)?(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/;

async function youtubedl(url) {
  try {
    const isUrl = (str) => /^https?:\/\//.test(str);

    if (!isUrl(url) || !/youtube\.com/i.test(url))
    throw new Error("Invalid URL: " + url);
    const info = await ytdl.getInfo(url);
    const downloadUrl = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' }).url;
    return {
     status: 200
     ...info,
     downloadUrl
    }
  } catch (error) {
    return {
     status: 404,
     msg: error?.message || error,
    }
  }
}
/**
 * Scrape from https://www.y2mate.com/
 * @param {string} url
 * @param {string} server
 * @returns {Promise<YoutubeDownloader>}
 */
async function youtubedl2(url, server = servers[0]) {
  const isUrl = (str) => /^https?:\/\//.test(str);

  if (!isUrl(url) || !/youtube\.com/i.test(url))
    throw new Error("Invalid URL: " + url);

  if (!servers.includes(server)) server = servers[0];
  const cookies = await getCookies();

  const json = await got
    .post(`https://www.y2mate.com/mates/analyzeV2/ajax`, {
      headers: {
        accept: "*/*",
        "accept-encoding": "gzip, deflate, br",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        cookie: cookies.join("; "),
        origin: "https://www.y2mate.com",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
      },
      form: {
        k_query: url,
        k_page: "home",
        hl: server,
        q_auto: 0, // maybe in the future this will cause an error?
      },
    })
    .json();

  const vid = json.vid;

  const video = {};
  const audio = {};

  for (const videoKey in json.links["mp4"]) {
    const _video = json.links["mp4"][videoKey];
    const quality = _video.q;
    if (_video.f !== "mp4") continue;
    const fileSizeH = _video.size;
    const fileSize = parseFileSize(fileSizeH);
    video[quality] = {
      quality,
      fileSizeH,
      fileSize,
      download: convert.bind(convert, vid, _video.k),
    };
  }

  for (const audioKey in json.links["mp3"]) {
    const _audio = json.links["mp3"][audioKey];
    const quality = _audio.q;
    if (_audio.f !== "mp3") continue;
    const fileSizeH = _audio.size;
    const fileSize = parseFileSize(fileSizeH);
    audio[quality] = {
      quality,
      fileSizeH,
      fileSize,
      download: convert.bind(convert, vid, _audio.k),
    };
  }

  const res = {
    status: 200,
    id: vid,
    thumbnail: `https://i.ytimg.com/vi/${vid}/0.jpg`,
    title: json.title,
    duration: json.t,
    video,
    audio,
  };

  return res;
}

/**
 * Parse file size from human-readable format to bytes
 * @param {string} size
 * @returns {number}
 */
function parseFileSize(size) {
  const sized = parseFloat(size);
  return (
    (isNaN(sized) ? 0 : sized) *
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

/**
 * Convert video with y2mate
 * @param {string} vid
 * @param {string} k
 * @returns {Promise<string>}
 */
async function convert(vid, k) {
  const cookies = await getCookies();
  const json = await got("https://www.y2mate.com/mates/convertV2/index", {
    method: "POST",
    headers: {
      accept: "*/*",
      "accept-encoding": "gzip, deflate, br",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      cookie: cookies.join("; "),
      origin: "https://www.y2mate.com",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
    },
    form: {
      vid,
      k,
    },
  }).json();

  return json.dlink;
}

function getCookies() {
  return new Promise((resolve, reject) => {
    got("https://www.y2mate.com/en872")
      .then((response) => {
        const cookiesArray = response.headers["set-cookie"];
        resolve(
          cookiesArray || [
            "_gid=GA1.2.2055666962.1683248123",
            "_ga=GA1.1.1570308475.1683248122",
            "_ga_K8CD7CY0TZ=GS1.1.1683248122.1.1.1683248164.0.0.0",
            "prefetchAd_3381349=true",
          ],
        );
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
}

module.exports = {
  ytdl: youtubedl,
};
