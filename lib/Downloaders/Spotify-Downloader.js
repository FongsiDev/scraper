const axios = require("axios");

async function spotifydl(url) {
  try {
    if (!global.isUrlFSPR(url) || !/open\.spotify\.com/i.test(url))
      return global.rejectFSPR("Invalid URL: " + url);
    return axios(
      `https://fongsi-scraper-rest-api.vercel.app/spotify?url=${url}`,
    ).then(({ data }) => {
      if(!data.status) return global.rejectFSPR(data.message);
      return global.resolveFSPR(data.data);
    });
  } catch (error) {
    return global.rejectFSPR(error);
  }
}

module.exports = spotifydl;
