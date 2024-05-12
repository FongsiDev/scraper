const axios = require("axios");

const domain = "https://www.tikwm.com/";

const tikVideo = (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!global.isUrlFSPR(url) || !/tiktok\.com/i.test(url))
        return global.rejectFSPR("Invalid URL: " + url);

      const res = await axios.post(
        domain + "/api/",
        {},
        {
          headers: {
            accept: "application/json, text/javascript, */*; q=0.01",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-ch-ua":
              '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
          },
          params: {
            url: url,
            count: 12,
            cursor: 0,
            web: 1,
            hd: 1,
          },
        },
      );

      if (res?.data?.code === -1) {
        resolve(global.rejectFSPR(res?.data));
      } else {
        resolve(global.resolveFSPR(updateUrls(res.data?.data)));
      }
    } catch (error) {
      resolve(global.rejectFSPR(error));
    }
  });
};

const tikUser = (user) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!user) return global.rejectFSPR("Where is the username?");
      const res = await axios.post(
        domain + "/api/user/posts",
        {},
        {
          headers: {
            accept: "application/json, text/javascript, */*; q=0.01",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-ch-ua":
              '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
          },
          params: {
            unique_id: user,
            count: 12,
            cursor: 0,
            web: 1,
            hd: 1,
          },
        },
      );

      const videos = res.data?.data?.videos;
      if (!videos || videos.length < 1) {
        resolve(global.rejectFSPR("The user has not uploaded any videos"));
      }

      const lastVideo = videos.sort((a, b) => b.create_time - a.create_time)[0];

      resolve(
        global.resolveFSPR({
          videos: videos.map((x) => updateUrls(x)),
          lastVideo: updateUrls(lastVideo),
        }),
      );
    } catch (error) {
      resolve(global.rejectFSPR(error));
    }
  });
};

function updateUrls(obj) {
  const regex =
    /("avatar": "|music": "|play": "|wmplay": "|hdplay": "|cover": ")(\/[^"]+)/g;
  const updatedData = JSON.stringify(obj, null, 2).replace(
    regex,
    (match, p1, p2) => p1 + domain + p2,
  );
  return JSON.parse(updatedData);
}

module.exports = { domain, tikVideo, tikUser };
