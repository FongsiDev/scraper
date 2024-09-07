const got = require("got");
const { sizeFormatter } = require("human-readable");
const axios = require("axios");
const ytdl = require("ytdl-core");
const crypto2 = require("crypto");

const toFormat = sizeFormatter({
  std: "JEDEC", // 'SI' (default) | 'IEC' | 'JEDEC'
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}`,
});

const servers = ["en", "id", "es"];
const ytIdRegex =
  /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:shorts\/)?(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/;

async function youtubedl4(url) {
  try {
    if (!global.isUrlFSPR(url) || !/youtube\.com/i.test(url))
      return global.rejectFSPR("Invalid URL: " + url);
    return axios(
      `https://fongsi-scraper-rest-api.vercel.app/yt?url=${url}`,
    ).then(({ data }) => {
      if(!data.status) return global.rejectFSPR(data.message);
      return global.resolveFSPR(data.data);
    });
  } catch (error) {
    return global.rejectFSPR(error);
  }
}

async function youtubedl(url) {
  try {
    if (!global.isUrlFSPR(url) || !/youtube\.com/i.test(url))
      return global.rejectFSPR("Invalid URL: " + url);
    const info = await ytdl.getInfo(url);
    const videoUrl = ytdl.chooseFormat(info.formats, {
      quality: "highestvideo",
      filter: "audioandvideo",
    }).url;
    const audioUrl = ytdl.chooseFormat(info.formats, {
      quality: "highestaudio",
      filter: "audioonly",
    }).url;
    return global.resolveFSPR({
      ...info.videoDetails,
      audioUrl,
      videoUrl,
    });
  } catch (error) {
    return global.rejectFSPR(error);
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
    return global.rejectFSPR("Invalid URL: " + url);

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

  const video = [];
  const audio = [];
  const other = [];

  for (const videoKey in json.links["mp4"]) {
    const _video = json.links["mp4"][videoKey];
    const quality = _video.q;
    if (_video.f !== "mp4") continue;
    const fileSizeH = _video.size;
    const fileSize = parseFileSize(fileSizeH);
    video.push({
      quality,
      fileSizeH,
      fileSize,
      download: convert.bind(convert, vid, _video.k),
    });
  }

  for (const audioKey in json.links["mp3"]) {
    const _audio = json.links["mp3"][audioKey];
    const quality = _audio.q;
    if (_audio.f !== "mp3") continue;
    const fileSizeH = _audio.size;
    const fileSize = parseFileSize(fileSizeH);
    audio.push({
      quality,
      fileSizeH,
      fileSize,
      download: convert.bind(convert, vid, _audio.k),
    });
  }

  for (const otherKey in json.links["other"]) {
    const _other = json.links["other"][otherKey];
    const quality = _other.q_text;
    //if (_other.f !== "mp4" || _other.f !== "webm") continue;
    const fileSizeH = _other.size;
    const fileSize = parseFileSize(fileSizeH);
    other.push({
      quality,
      fileSizeH,
      fileSize,
      download: convert.bind(convert, vid, _other.k),
    });
  }

  video.sort((a, b) => b.fileSize - a.fileSize);
  audio.sort((a, b) => b.fileSize - a.fileSize);
  other.sort((a, b) => b.fileSize - a.fileSize);

  const res = {
    id: vid,
    thumbnail: `https://i.ytimg.com/vi/${vid}/0.jpg`,
    title: json.title,
    duration: json.t,
    video,
    audio,
    other,
  };

  return global.resolveFSPR(res);
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
/*
async function youtubedl3(url) {
  try {
    if (!global.isUrlFSPR(url) || !/youtube\.com/i.test(url))
      return global.rejectFSPR("Invalid URL: " + url);

    const result = await youtubeDL(url, {
      dumpSingleJson: true,
      noWarnings: true,
      noCallHome: true,
      preferFreeFormats: false,
      youtubeSkipDashManifest: true,
    });

    const formats = result.formats;

    const video = [];
    const audio = [];
    const other = [];

    formats.forEach((format) => {
      if (/manifest/i.test(format.url)) return;
      if (format.vcodec !== "none" && format.acodec !== "none") {
        video.push({
          resolution: parseInt(format.height), // Ensure numeric resolution
          url: format.url,
          width: format.width,
          height: format.height,
          format: format.ext,
          filesize: format.filesize,
        });
      } else if (format.acodec !== "none" && format.vcodec === "none") {
        audio.push({
          formatId: parseInt(format.format_id) || format.format_id, // Handle non-numeric IDs
          url: format.url,
          format: format.ext,
          filesize: format.filesize,
        });
      } else {
        other.push({
          formatId: format.format_id,
          url: format.url,
          format: format.ext,
          filesize: format.filesize,
        });
      }
    });

    // Sort video by resolution (highest to lowest)
    video.sort((a, b) => b.resolution - a.resolution);

    // Sort audio by formatId (assuming numeric, fallback to string comparison)
    audio.sort((a, b) => {
      if (typeof a.formatId === "number" && typeof b.formatId === "number") {
        return b.formatId - a.formatId;
      } else {
        return ("" + b.formatId).localeCompare("" + a.formatId);
      }
    });

    return global.resolveFSPR({
      video,
      audio,
      other,
    });
  } catch (error) {
    return global.rejectFSPR(error);
  }
}*/

module.exports = youtubedl4;
