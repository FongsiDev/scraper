const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const get = axios.create({
  headers: {
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-language": "it-IT,it;q=0.9,en-GB;q=0.8,en;q=0.7,en-US;q=0.6",
    "cache-control": "max-age=0",
    "sec-ch-ua":
      '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    "viewport-width": "1920",
  },
});

async function facebookdl(Url) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!global.isUrlFSPR(Url) || !/facebook\.com/i.test(Url))
        return global.rejectFSPR("Invalid URL: " + Url);

      await get(`https://fongsi-scraper-rest-api.vercel.app/fb?url=${Url}`)
        .then(({ data }) => {
          if(!data.status) resolve(global.rejectFSPR(data.message));
          resolve(global.resolveFSPR(data.data));
          /*const $ = cheerio.load(data);

          var dataInfo;
          var type;

          const jsonDataElements = $('script[type="application/json"]');
          jsonDataElements.each((index, element) => {
            const content = $(element).html();
            if (/FBQualityLabel/i.test(content)) {
              if (/playlist/i.test(content)) {
                dataInfo = getValueFromNestedObject(
                  JSON.parse(content),
                  "creation_story",
                );
                type = "video";
              }
            } else if (/StoryAttachmentPhotoStyleRenderer/i.test(content)) {
              if (/comet_sections/i.test(content)) {
                dataInfo = getValueFromNestedObject(
                  JSON.parse(content),
                  "comet_sections",
                );
                type = "story";
              }
            }
          });
          if (type == "video") {
            const user = getValueFromNestedObject(dataInfo, "video_owner");
            const video = getValueFromNestedObject(dataInfo, "playback_video");
            const videoContext = getValueFromNestedObject(
              dataInfo,
              "short_form_video_context",
            );
            const videoInfo = {
              title: dataInfo.message.text,
              permalink_url: video.permalink_url,
              creation_time: dataInfo.creation_time,
              duration: video.length_in_second,
            };
            const author = {
              username: user.name,
              user_id: user.id,
              is_verified: user.is_verified,
              profileImageUrl: user.displayPicture.uri,
              url: user.url,
            };
            const media = {
              thumbnail: video.preferred_thumbnail.image.uri,
              video_sd: video.browser_native_sd_url,
              video_hd: video.browser_native_hd_url,
            };
            const music = {
              track_title: videoContext.track_title,
              music_album_art_url: videoContext.music_album_art_uri,
              is_original_audio_on_facebook:
                videoContext.is_original_audio_on_facebook,
            };
            return { videoInfo, author, media, music };
          } else if (type == "story") {
            const story = getValueFromNestedObject(dataInfo, "story");
            const storyContext = getValueFromNestedObject(
              dataInfo,
              "context_layout",
            );
            const cometSections = getValueFromNestedObject(
              storyContext,
              "comet_sections",
            );
            const actorPhoto = getValueFromNestedObject(
              storyContext,
              "actor_photo",
            );
            const storyPhoto = getValueFromNestedObject(actorPhoto, "story");
            const storyInfo = {
              title: story.message.text,
              permalink_url: story.wwwURL,
              creation_time: cometSections.metadata[0].story.creation_time,
            };
            const author = {
              username: storyPhoto.actors[0].name,
              user_id: storyPhoto.actors[0].id,
              is_verified: storyPhoto.actors[0].is_verified,
              profileImageUrl: storyPhoto.actors[0].profile_picture.uri,
              url: storyPhoto.actors[0].profile_url,
            };
            const media = {
              attachments: story.attachments.map((x) => {
                const photo_image = getValueFromNestedObject(x, "photo_image");
                return photo_image.uri;
              }),
            };
            return { storyInfo, author, media };
          } else {
            return "Invalid Url Facebook";
          }*/
        })
        .catch((error) => {
          resolve(global.rejectFSPR(error));
        });
    } catch (error) {
      resolve(global.rejectFSPR(error));
    }
  });
}

module.exports = facebookdl;

function getValueFromNestedObject(data, key) {
  let result;
  function search(obj) {
    if (obj && typeof obj === "object") {
      if (Array.isArray(obj)) {
        for (let item of obj) {
          search(item);
          if (result !== undefined) return;
        }
      } else {
        for (let k in obj) {
          if (k === key) {
            result = obj[k];
            return;
          }
          search(obj[k]);
          if (result !== undefined) return;
        }
      }
    }
  }
  search(data);
  return result;
}

function getValueByKey(data, key) {
  const regex = new RegExp(
    `"${key}":\\s*(?:(\\[.*\\])|(false|true|".*"|\\d+))`,
  );
  const match = JSON.stringify(data).match(regex);
  if (match) {
    return JSON.parse(match[1] ? match[1] : match[2]);
  } else {
    return null;
  }
}
