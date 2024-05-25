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

      var url = new URL(Url);
      url.hostname = "m.facebook.com";
      const newUrl = url.toString();
      await get(newUrl)
        .then(({ data }) => {
          //fs.writeFileSync("file.txt.html", data, "utf8");
          //Media
          const videoSdUrlMatch = data.match(/"browser_native_sd_url":"(.*?)"/);
          const videoHdUrlMatch = data.match(/"browser_native_hd_url":"(.*?)"/);
          const thumbnailUriMatch = data.match(
            /"preferred_thumbnail":{"image":{"uri":"(.*?)"/,
          );
          const photoImageMatch = data.match(/"photo_image":{"uri":"(.*?)"/);

          const videoSdUrl = videoSdUrlMatch
            ? eval(`'${videoSdUrlMatch[1]}'`)
            : null;
          const videoHdUrl = videoHdUrlMatch
            ? eval(`'${videoHdUrlMatch[1]}'`)
            : null;
          const thumbnailUri = thumbnailUriMatch
            ? eval(`'${thumbnailUriMatch[1]}'`)
            : null;
          const photo_image = photoImageMatch
            ? eval(`'${photoImageMatch[1]}'`)
            : null;

          const media = {
            thumbnail: thumbnailUri,
            photo_image: photo_image,
            video_sd: videoSdUrl,
            video_hd: videoHdUrl,
          };

          //Info
          const titleMatch = data.match(/"message":{"text":"(.*?)"/);
          const videoUrlMatch = data.match(/"permalink_url":"(.*?)"/);
          const videoUrlMatch2 = data.match(/"wwwURL":"(.*?)"/);
          const timeMatch = data.match(/"creation_time":\s*(\d+)/);
          const durationMatch = data.match(
            /"playable_duration_in_ms":\s*(\d+)/,
          );

          const title = titleMatch ? eval(`'${titleMatch[1]}'`) : null;
          const permalink_url = videoUrlMatch
            ? eval(`'${videoUrlMatch[1]}'`)
            : videoUrlMatch2
              ? eval(`'${videoUrlMatch2[1]}'`)
              : null;
          const creation_time = timeMatch ? eval(`'${timeMatch[1]}'`) : null;
          const duration = durationMatch ? eval(`'${durationMatch[1]}'`) : null;

          const info = {
            title,
            permalink_url: permalink_url,
            creation_time: creation_time,
            duration: duration,
          };

          //Author
          const ownerMatch = data.match(
            /"video_owner":\s*{\s*[^}]*"name":\s*"([^"]+)"[^}]*"id":\s*"([^"]+)"/,
          );
          const userMatch = data.match(
            /"actors":\s*\[\s*{\s*"__typename":\s*"User",\s*"id":\s*"([^"]+)",\s*"name":\s*"([^"]+)",\s*"__isEntity":\s*"User",\s*"url":\s*"([^"]+)"\s*}\s*\]/,
          );
          const ownerAsPageMatch = data.match(
            /"owner_as_page":\s*\{\s*"id":\s*"([^"]+)",\s*"category_type":\s*"([^"]+)",\s*"name":\s*"([^"]+)",\s*"does_viewer_follow":\s*(false|true),\s*"live_video_subscription_status":\s*"([^"]+)",\s*"profile_pic_uri":\s*"([^"]+)"/,
          );
          /*data.match(
            /"user":\s*{"name":"([^"]+)","profile_picture":{"uri":"([^"]+)"},"id":"([^"]+)"}/,
          );*/

          const isVerifiedMatch = data.match(/"is_verified":\s*(true|false)/);
          const userProfileUrlMatch = data.match(
            /"profile_picture":{"uri":"(.*?)"/,
          );

          const username = ownerMatch
            ? eval(`'${ownerMatch[1]}'`)
            : userMatch
              ? eval(`'${userMatch[2]}'`)
              : ownerAsPageMatch
                ? eval(`'${ownerAsPageMatch[3]}'`)
                : null;
          const userId = ownerMatch
            ? ownerMatch[2]
            : userMatch
              ? userMatch[1]
              : ownerAsPageMatch
                ? ownerAsPageMatch[1]
                : null;
          const isVerified = isVerifiedMatch
            ? isVerifiedMatch[1] === "true"
            : null;
          const userProfileUrl = userProfileUrlMatch
            ? eval(`'${userProfileUrlMatch[1]}'`)
            : null;

          const author = {
            username,
            user_id: userId,
            is_verified: isVerified,
            profileImageUrl: userProfileUrl,
            //url: user.url,
          };
          resolve(global.resolveFSPR({ info, author, media }));
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
