const axios = require("axios");
const fs = require("fs");
const RSSParser = require("rss-parser");

/**
 * Get full information about a YouTube channel
 */
const merge2Obj = (one, two) => {
  for (const key in two) {
    if (Object.prototype.hasOwnProperty.call(two, key)) {
      const ele = two[key];
      if (typeof ele === "object") one[key] = merge2Obj(one[key], ele);
      else one[key] = ele;
    }
  }
  return one;
};
const mergeObj = (res, ...objs) => {
  objs.forEach((obj) => merge2Obj(res, obj));
  return res;
};

function GetObject(path, jsonData) {
  try {
    const parsedData = jsonData;
    const keys = path.split(".");

    function searchKeys(keys, current) {
      if (keys.length === 0) {
        return current;
      }

      const key = keys[0];
      const remainingKeys = keys.slice(1);

      if (typeof current === "object" && current !== null) {
        if (current.hasOwnProperty(key)) {
          return searchKeys(remainingKeys, current[key]);
        }

        // Search in array elements if current is an array
        if (Array.isArray(current)) {
          for (let item of current) {
            const result = searchKeys(keys, item);
            if (result !== undefined) {
              return result;
            }
          }
        }

        // Search in object properties
        for (let prop in current) {
          if (current.hasOwnProperty(prop)) {
            const result = searchKeys(keys, current[prop]);
            if (result !== undefined) {
              return result;
            }
          }
        }
      }

      return undefined;
    }

    return searchKeys(keys, parsedData);
  } catch (error) {
    console.error("Error:", error);
    return undefined;
  }
}

function parseStringToArray(input) {
  // Regex to match either quoted text or words
  const regex = /"([^"]+)"|(\S+)/g;
  const result = [];
  let match;

  while ((match = regex.exec(input)) !== null) {
    // Match the quoted text or word and add to result
    result.push(match[1] || match[2]);
  }

  return result;
}

function extractYoutubeIdentifier(url) {
  const channelRegex = /youtube\.com\/channel\/([^\/]+)/;
  const userRegex = /youtube\.com\/user\/([^\/]+)/;
  const customRegex = /youtube\.com\/c\/([^\/]+)/;
  const handleRegex = /youtube\.com\/@([^\/]+)/;
  const generalRegex = /youtube\.com\/([^\/]+)/;

  let match =
    url.match(channelRegex) ||
    url.match(userRegex) ||
    url.match(customRegex) ||
    url.match(handleRegex) ||
    url.match(generalRegex);

  return match ? match[1] : null;
}
function addPathToUrl(url, additionalPath) {
  try {
    const urlObj = new URL(url);
    const currentPath = urlObj.pathname;
    const patterns = [
      /\/channel\/([^\/]+)/,
      /\/user\/([^\/]+)/,
      /\/c\/([^\/]+)/,
      /\/@([^\/]+)/,
      /\/([^\/]+)/,
    ];
    for (let pattern of patterns) {
      const match = currentPath.match(pattern);
      if (match) {
        urlObj.pathname = `${match[0]}${additionalPath}`;
        return urlObj.toString();
      }
    }
    urlObj.pathname = `${currentPath}${additionalPath}`;
    return urlObj.toString();
  } catch (error) {
    return url;
  }
}

async function getLatestVideo(url) {
  return new Promise((resolve, reject) => {
    const parser = new RSSParser();
    parser
      .parseURL(url)
      .then((response) => {
        const ITEM = response.items[0];
        if (!ITEM) resolve(undefined);
        resolve(ITEM.id.replace("yt:video:", ""));
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function channelInfo(url, options = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !global.isUrlFSPR(url) ||
        !/youtube\.com/i.test(url) ||
        !extractYoutubeIdentifier(url)
      )
        return resolve(
          global.rejectFSPR("Invalid Channel YouTube URL: " + url),
        );

      options = mergeObj(
        {
          requestOptions: {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0",
            },
          },
        },
        options,
      );
      await axios
        .get(
          addPathToUrl(url, "/videos"),
          Object.assign(Object.assign({}, options.requestOptions)),
          {
            responseType: "text",
          },
        )
        .then(async ({ data }) => {
          var initialData = data.match(/var ytInitialData = ({[\s\S]*?});/);
          if (initialData && initialData[1]) {
            try {
              initialData = JSON.parse(initialData[1]);
              const videos = GetObject(
                "content.richGridRenderer.contents",
                initialData,
              )
                .map((item) => {
                  const videoRenderer =
                    item?.richItemRenderer?.content?.videoRenderer;
                  if (!videoRenderer) {
                    return null;
                  }
                  return {
                    videoId: GetObject("videoId", videoRenderer),
                    title: GetObject("title.runs", videoRenderer)?.[0]?.text,
                    url: `https://youtu.be/${GetObject("videoId", videoRenderer)}`,
                    description: GetObject(
                      "descriptionSnippet.runs",
                      videoRenderer,
                    )?.[0]?.text,
                    publishedTimeText: GetObject(
                      "publishedTimeText.simpleText",
                      videoRenderer,
                    ),
                    durationText: GetObject(
                      "lengthText.accessibility.accessibilityData.label",
                      videoRenderer,
                    ),
                    viewCountText: GetObject(
                      "viewCountText.simpleText",
                      videoRenderer,
                    ),
                    thumbnail: GetObject(
                      "thumbnail.thumbnails",
                      videoRenderer,
                    )?.sort((a, b) => b.width - a.width),
                  };
                })
                .filter(Boolean);
              const lastVideoId = await getLatestVideo(
                GetObject(
                  "metadata.channelMetadataRenderer.rssUrl",
                  initialData,
                ),
              );

              var channel = {
                name: GetObject(
                  "metadata.channelMetadataRenderer.title",
                  initialData,
                ),
                id: GetObject(
                  "metadata.channelMetadataRenderer.externalId",
                  initialData,
                ),
                url: GetObject(
                  "metadata.channelMetadataRenderer.channelUrl",
                  initialData,
                ),
                shortUrl: GetObject(
                  "metadata.channelMetadataRenderer.vanityChannelUrl",
                  initialData,
                ),
                rssUrl: GetObject(
                  "metadata.channelMetadataRenderer.rssUrl",
                  initialData,
                ),
                description: GetObject(
                  "metadata.channelMetadataRenderer.description",
                  initialData,
                ),
                subscribers:
                  GetObject("subscriberCountText.simpleText", initialData) ??
                  GetObject(
                    "text.content",
                    GetObject(
                      "contentMetadataViewModel.metadataRows",
                      initialData,
                    )?.[1]?.metadataParts?.[0],
                  ),
                totalVideos:
                  GetObject("subscriberCountText.simpleText", initialData) ??
                  GetObject(
                    "text.content",
                    GetObject(
                      "contentMetadataViewModel.metadataRows",
                      initialData,
                    )?.[1]?.metadataParts?.[1],
                  ),
                avatar: GetObject(
                  "decoratedAvatarViewModel.avatar.image.sources",
                  initialData,
                )?.sort((a, b) => b.width - a.width),
                banner: GetObject(
                  "imageBannerViewModel.image.sources",
                  initialData,
                )?.sort((a, b) => b.width - a.width),
                tags: parseStringToArray(
                  GetObject(
                    "metadata.channelMetadataRenderer.keywords",
                    initialData,
                  ),
                ),
                unlisted: GetObject(
                  "microformat.microformatDataRenderer.unlisted",
                  initialData,
                ),
                familySafe: GetObject(
                  "metadata.channelMetadataRenderer.isFamilySafe",
                  initialData,
                ),
                lastVideo:
                  videos.filter((x) => x.videoId === lastVideoId)[0] ??
                  videos[0],
                videos,
              };

              resolve(global.resolveFSPR(channel));
            } catch (err) {
              console.log(err);
              resolve(global.rejectFSPR(err));
            }
          } else {
            resolve(
              global.rejectFSPR(
                "The channel does not exist or is missing, try checking again",
              ),
            );
          }
        })
        .catch((error) => {
          resolve(
            global.rejectFSPR(
              "The channel does not exist or is missing, try checking again",
            ),
          );
        });
    } catch (error) {
      resolve(global.rejectFSPR(error));
    }
  });
}

module.exports = channelInfo;
