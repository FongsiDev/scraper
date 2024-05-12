const axios = require("axios");
const features = require("../../utils/features.js");
const header = require("../../utils/header.js");

const millsToMinutesAndSeconds = (millis) => {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
};

const getGuestTokenAuthorization = async () => {
  const { data } = await axios.get("https://pastebin.com/raw/nz3ApKQM");
  return data;
};

const getTwitterAuthorization = async () => {
  const { data } = await axios.get("https://pastebin.com/raw/Bu7XFnpE");
  return data;
};

const getGuestToken = async () => {
  try {
    const { data } = await axios(
      "https://api.twitter.com/1.1/guest/activate.json",
      {
        method: "POST",
        headers: {
          Authorization: await getGuestTokenAuthorization(),
          ...header(),
        },
      },
    );
    return data.guest_token;
  } catch {
    return null;
  }
};

function twitterdl(Url, config) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!global.isUrlFSPR(Url) || !/x\.com|twitter\.com/i.test(Url))
        return global.rejectFSPR("Invalid URL: " + Url);
      const id = Url.match(/\/([\d]+)/);
      if (!id)
        return resolve(
          global.rejectFSPR(
            "There was an error getting twitter id. Make sure your twitter url is correct!",
          ),
        );
      const guest_token = await getGuestToken();
      const csrf_token = config?.cookie
        ? config.cookie.match(/(?:^|; )ct0=([^;]*)/)
        : "";

      if (!guest_token)
        return resolve(
          global.rejectFSPR(
            "Failed to get Guest Token. Authorization is invalid!",
          ),
        );
      await axios
        .get(
          "https://api.twitter.com/graphql/7xflPyRiUxGVbJd4uWmbfg/TweetResultByRestId",
          {
            params: {
              variables: JSON.stringify({
                tweetId: id[1],
                withCommunity: false,
                includePromotedContent: false,
                withVoice: false,
              }),
              features: JSON.stringify(features),
              fieldToggles: JSON.stringify({
                withArticleRichContentState: true,
                withArticlePlainText: false,
              }),
            },
            headers: {
              Authorization: config?.authorization
                ? config.authorization
                : await getTwitterAuthorization(),
              Cookie: config?.cookie ? config.cookie : "",
              "x-csrf-token": csrf_token ? csrf_token[1] : "",
              "x-guest-token": guest_token,
              ...header(),
            },
          },
        )
        .then(({ data }) => {
          if (!data.data.tweetResult?.result) {
            return resolve(global.rejectFSPR("Tweet not found!"));
          }
          if (data.data.tweetResult.result?.reason === "NsfwLoggedOut") {
            /** Use Cookies to avoid errors */
            return resolve(
              global.rejectFSPR(
                "This tweet contains sensitive content! Please use cookies to avoid errors!",
              ),
            );
          }
          const result =
            data.data.tweetResult.result.__typename ===
            "TweetWithVisibilityResults"
              ? data.data.tweetResult.result.tweet
              : data.data.tweetResult.result;
          const statistics = {
            replieCount: result.legacy.reply_count,
            retweetCount: result.legacy.retweet_count,
            favoriteCount: result.legacy.favorite_count,
            viewCount: Number(result.views.count),
          };
          const user = result.core.user_results.result;
          const author = {
            username: user.legacy.screen_name,
            bio: user.legacy.description,
            possiblySensitive: user.legacy.possibly_sensitive,
            verified: user.legacy.verified,
            location: user.legacy.location,
            profileBannerUrl: user.legacy.profile_banner_url,
            profileImageUrl: user.legacy.profile_image_url_https,
            url: "https://twitter.com/" + user.legacy.screen_name,
            statistics: {
              favoriteCount: user.legacy.favourites_count,
              followersCount: user.legacy.followers_count,
              friendsCount: user.legacy.friends_count,
              statusesCount: user.legacy.statuses_count,
              listedCount: user.legacy.listed_count,
              mediaCount: user.legacy.media_count,
            },
          };
          const media =
            result.legacy?.entities?.media?.map((v) => {
              if (v.type === "photo") {
                return {
                  type: v.type,
                  image: v.media_url_https,
                  expandedUrl: v.expanded_url,
                };
              } else {
                const isGif = v.type === "animated_gif";
                const videos = v.video_info.variants
                  .filter((video) => video.content_type === "video/mp4")
                  .map((variants) => {
                    let quality = isGif
                      ? `${v.original_info.width}x${v.original_info.height}`
                      : variants.url.match(/\/([\d]+x[\d]+)\//)[1];
                    return {
                      bitrate: variants.bitrate,
                      content_type: variants.content_type,
                      quality,
                      url: variants.url,
                    };
                  });
                return {
                  type: v.type,
                  cover: v.media_url_https,
                  duration: millsToMinutesAndSeconds(
                    v.video_info.duration_millis,
                  ),
                  expandedUrl: v.expanded_url,
                  videos,
                };
              }
            }) || [];
          resolve(
            global.resolveFSPR({
              id: result.legacy.id_str,
              createdAt: result.legacy.created_at,
              description: result.legacy.full_text,
              languange: result.legacy.lang,
              possiblySensitive: result.legacy.possibly_sensitive || false,
              possiblySensitiveEditable:
                result.legacy.possibly_sensitive_editable || false,
              isQuoteStatus: result.legacy.is_quote_status,
              mediaCount: media.length,
              author,
              statistics,
              media,
            }),
          );
        })
        .catch((error) => {
          return resolve(global.rejectFSPR(error));
        });
    } catch (error) {
      resolve(global.rejectFSPR(error));
    }
  });
}

module.exports = twitterdl;
