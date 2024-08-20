const http = require("http");
const request = require("request");

const querystring = (object) =>
  Object.keys(object)
    .map((key) => `${key}=${object[key]}`)
    .join("&");

class Instagram {
  constructor() {
    this.httpUri = "https://instagram.com/";
    this.headers = {
      authority: "www.instagram.com",
      accept: "*/*",
      "accept-language": "ms-MY,ms;q=0.9,en-US;q=0.8,en;q=0.7",
      referer: "https://www.instagram.com",
      "sec-ch-prefers-color-scheme": "dark",
      "sec-ch-ua": '"Not)A;Brand";v="24", "Chromium";v="116"',
      "sec-ch-ua-full-version-list":
        '"Not)A;Brand";v="24.0.0.0", "Chromium";v="116.0.5845.240"',
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-model": '"220333QAG"',
      "sec-ch-ua-platform": '"Android"',
      "sec-ch-ua-platform-version": '"11.0.0"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "user-agent":
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
      "x-ig-app-id": "1217981644879628",
      "x-ig-www-claim": "0",
      "x-requested-with": "XMLHttpRequest",
    };
  }

  getUserProfile(username) {
    const uri = `${this.httpUri}api/v1/users/web_profile_info/`;
    return new Promise((resolve, reject) => {
      request(
        {
          uri: uri,
          qs: {
            username: username,
          },
          method: "GET",
          headers: this.headers,
        },
        (error, response, body) => {
          if (response.statusCode !== 200) reject(error);

          const result = JSON.parse(body);
          const { user } = result.data;
          let resultBuilder = {
            instagram_id: user.id,
            is_private: user.is_private,
            full_name: user.full_name,
            username: user.username,
            bio: user.biography,
            website: user.external_url,
            followers: user.edge_followed_by.count,
            following: user.edge_follow.count,
            profile_pic: user.profile_pic_url_hd,
            total_posts: user.edge_owner_to_timeline_media.count,
            posts: [],
          };

          user.edge_owner_to_timeline_media.edges.map((post) => {
            let postBuilder = {
              id_post: post.node.shortcode,
              is_video: post.node.is_video,
              likes: post.node.edge_liked_by.count,
              total_comments: post.node.edge_media_to_comment.count,
              location: post.node.location,
              caption:
                post.node.edge_media_to_caption.edges.length !== 0
                  ? post.node.edge_media_to_caption.edges[0].node.text
                  : "",
              media: post.node.display_url,
              tagged_user: [],
            };

            post.node.edge_media_to_tagged_user.edges.map((user) => {
              postBuilder.tagged_user.push(user.node.user);
            });

            resultBuilder.posts.push(postBuilder);
          });

          resolve(resultBuilder);
        },
      );
    });
  }

  getPostByHashtag(hashtag_param) {
    const uri = `${this.httpUri}api/v1/tags/logged_out_web_info/`;
    return new Promise((resolve, reject) => {
      request(
        {
          uri: uri,
          qs: {
            tag_name: hashtag_param,
          },
          method: "GET",
          headers: this.headers,
        },
        (error, response, body) => {
          if (response.statusCode !== 200) reject(error);
          const result = JSON.parse(body);
          const { hashtag } = result.data;
          let resultBuilder = {
            hashtag_id: hashtag.id,
            hashtag_name: hashtag.name,
            pic_url: hashtag.profile_pic_url,
            new_posts: [],
            top_posts: [],
          };

          hashtag.edge_hashtag_to_media.edges.map((new_post) => {
            let new_post_builder = {
              id_post: new_post.node.shortcode,
              is_video: new_post.node.is_video,
              likes: new_post.node.edge_liked_by.count,
              total_comments: new_post.node.edge_media_to_comment.count,
              caption:
                new_post.node.edge_media_to_caption.edges.length !== 0
                  ? new_post.node.edge_media_to_caption.edges[0].node.text
                  : "",
              media: new_post.node.display_url,
            };

            resultBuilder.new_posts.push(new_post_builder);
          });

          hashtag.edge_hashtag_to_top_posts.edges.map((top_post) => {
            let top_post_builder = {
              id_post: top_post.node.shortcode,
              is_video: top_post.node.is_video,
              likes: top_post.node.edge_liked_by.count,
              total_comments: top_post.node.edge_media_to_comment.count,
              caption:
                top_post.node.edge_media_to_caption.edges.length !== 0
                  ? top_post.node.edge_media_to_caption.edges[0].node.text
                  : "",
              media: top_post.node.display_url,
            };

            resultBuilder.top_posts.push(top_post_builder);
          });

          resolve(resultBuilder);
        },
      );
    });
  }

  getPostByLocation(location_id, slug) {
    const uri = `${this.httpUri}explore/locations/${location_id}/${slug}/?__a=1`;
    return new Promise((resolve, reject) => {
      request(
        {
          uri: uri,
          method: "GET",
        },
        (error, response, body) => {
          if (response.statusCode !== 200) reject(error);
          const result = JSON.parse(body);
          const { location } = result.graphql;
          let resultBuilder = {
            hashtag_id: location.id,
            location_name: location.name,
            pic_url: location.profile_pic_url,
            website: location.website,
            phone: location.phone,
            country: location.directory.name,
            new_posts: [],
            top_posts: [],
          };

          location.edge_location_to_media.edges.map((new_post) => {
            let new_post_builder = {
              id_post: new_post.node.shortcode,
              is_video: new_post.node.is_video,
              likes: new_post.node.edge_liked_by.count,
              total_comments: new_post.node.edge_media_to_comment.count,
              caption:
                new_post.node.edge_media_to_caption.edges.length !== 0
                  ? new_post.node.edge_media_to_caption.edges[0].node.text
                  : "",
              media: new_post.node.display_url,
            };

            resultBuilder.new_posts.push(new_post_builder);
          });

          location.edge_location_to_top_posts.edges.map((top_post) => {
            let top_post_builder = {
              id_post: top_post.node.shortcode,
              is_video: top_post.node.is_video,
              likes: top_post.node.edge_liked_by.count,
              total_comments: top_post.node.edge_media_to_comment.count,
              caption:
                top_post.node.edge_media_to_caption.edges.length !== 0
                  ? top_post.node.edge_media_to_caption.edges[0].node.text
                  : "",
              media: top_post.node.display_url,
            };

            resultBuilder.top_posts.push(top_post_builder);
          });

          resolve(resultBuilder);
        },
      );
    });
  }

  getDetailPost(id_post) {
    const uri = `${this.httpUri}graphql/query`;
    var headers = {
      authority: "www.instagram.com",
      accept: "*/*",
      "accept-language": "ms-MY,ms;q=0.9,en-US;q=0.8,en;q=0.7",
      "content-type": "application/x-www-form-urlencoded",
      origin: "https://www.instagram.com",
      referer: "https://www.instagram.com",
      "sec-ch-prefers-color-scheme": "dark",
      "sec-ch-ua": '"Not)A;Brand";v="24", "Chromium";v="116"',
      "sec-ch-ua-full-version-list":
        '"Not)A;Brand";v="24.0.0.0", "Chromium";v="116.0.5845.240"',
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-model": '"220333QAG"',
      "sec-ch-ua-platform": '"Android"',
      "sec-ch-ua-platform-version": '"11.0.0"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "user-agent":
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
      "x-ig-app-id": "1217981644879628",
    };
    const json = {
      av: 0,
      __d: "www",
      __user: 0,
      __a: 1,
      __req: 4,
      __hs: "19917.HYP:instagram_web_pkg.2.1..0.0",
      dpr: 3,
      __ccg: "UNKNOWN",
      __rev: 1014859090,
      __s: "yv9ckn:o92qp4:cbkbr0",
      __hsi: 7390920007022059549,
      __dyn:
        "7xeUjG1mxu1syUbFp41twpUnwgU7SbzEdF8aUco2qwJw5ux609vCwjE1xoswaq0yE6ucw5Mx62G5UswoEcE7O2l0Fwqo31w9O1TwQzXwae4UaEW2G0AEcobEaU2eUlwhEe87q7U1bobpEbUGdG1QwVwDwHg2ZwrUdUbGwmk0zU8oC1Iwqo5q3e3zhA6bwIxe6V89F8uxK3OqcxKu2e",
      __csr:
        "gJ13Mx2c-IoD9Rif9laDRtFtp2vX9Vy4DFeGjWKiF4HRJuXKBGXAmnyWGXBy9qVuJbByHAGmQmiqqaiWXAW_hbKWAXCqXAQbCBiAhbG59Uyq49p98qm9UWEOUx2opUN4KrDDDACyu4UugSTCumq58-udGbw05s5wGwv30fYwrDxeu0Ookw3ZE0qJonA988ojwwwnja4kaysE2LQD82eu04qe2p023Pwr81HU6u0jV087whE7q1Bg35Cw09jO",
      __comet_req: 7,
      lsd: "AVrWB4cIOwU",
      jazoest: 2925,
      __spin_r: 1014859090,
      __spin_b: "trunk",
      __spin_t: 1720832662,
      fb_api_caller_class: "RelayModern",
      fb_api_req_friendly_name: "PolarisPostActionLoadPostQueryQuery",
      variables: JSON.stringify({
        shortcode: id_post,
        fetch_comment_count: 40,
        parent_comment_count: 24,
        child_comment_count: 3,
        fetch_like_count: 10,
        fetch_tagged_user_count: null,
        fetch_preview_comment_count: 2,
        has_threaded_comments: true,
        hoisted_comment_id: null,
        hoisted_reply_id: null,
      }),
      server_timestamps: true,
      doc_id: 25531498899829322,
    };

    const bodyString = querystring();
    var dataString =
      "av=0&__d=www&__user=0&__a=1&__req=4&__hs=19917.HYP%3Ainstagram_web_pkg.2.1..0.0&dpr=3&__ccg=UNKNOWN&__rev=1014859090&__s=yv9ckn%3Ao92qp4%3Acbkbr0&__hsi=7390920007022059549&__dyn=7xeUjG1mxu1syUbFp41twpUnwgU7SbzEdF8aUco2qwJw5ux609vCwjE1xoswaq0yE6ucw5Mx62G5UswoEcE7O2l0Fwqo31w9O1TwQzXwae4UaEW2G0AEcobEaU2eUlwhEe87q7U1bobpEbUGdG1QwVwDwHg2ZwrUdUbGwmk0zU8oC1Iwqo5q3e3zhA6bwIxe6V89F8uxK3OqcxKu2e&__csr=gJ13Mx2c-IoD9Rif9laDRtFtp2vX9Vy4DFeGjWKiF4HRJuXKBGXAmnyWGXBy9qVuJbByHAGmQmiqqaiWXAW_hbKWAXCqXAQbCBiAhbG59Uyq49p98qm9UWEOUx2opUN4KrDDDACyu4UugSTCumq58-udGbw05s5wGwv30fYwrDxeu0Ookw3ZE0qJonA988ojwwwnja4kaysE2LQD82eu04qe2p023Pwr81HU6u0jV087whE7q1Bg35Cw09jO&__comet_req=7&lsd=AVrWB4cIOwU&jazoest=2925&__spin_r=1014859090&__spin_b=trunk&__spin_t=1720832662&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=PolarisPostActionLoadPostQueryQuery&variables=%7B%22shortcode%22%3A%22C8MuVNCh-3r%22%2C%22fetch_comment_count%22%3A40%2C%22parent_comment_count%22%3A24%2C%22child_comment_count%22%3A3%2C%22fetch_like_count%22%3A10%2C%22fetch_tagged_user_count%22%3Anull%2C%22fetch_preview_comment_count%22%3A2%2C%22has_threaded_comments%22%3Atrue%2C%22hoisted_comment_id%22%3Anull%2C%22hoisted_reply_id%22%3Anull%7D&server_timestamps=true&doc_id=25531498899829322";

    console.log(bodyString, bodyString == dataString);
    return new Promise((resolve, reject) => {
      request(
        {
          uri: uri,
          method: "POST",
          headers: headers,
          body: bodyString,
        },
        (error, response, body) => {
          if (response.statusCode !== 200) reject(error);
          const result = JSON.parse(body);
          const { xdt_shortcode_media: shortcode_media } = result.data;

          let resultBuilder = {
            media: shortcode_media.display_url,
            is_video: shortcode_media.is_video,
            caption:
              shortcode_media.edge_media_to_caption.edges.length !== 0
                ? shortcode_media.edge_media_to_caption.edges[0].node.text
                : "",
            likes: shortcode_media.edge_media_preview_like.count,
            total_comments: shortcode_media.edge_media_to_parent_comment.count,
            location: shortcode_media.location,
            tagged_user: [],
            comments: [],
            owner: {
              instagram_id: shortcode_media.owner.id,
              full_name: shortcode_media.owner.full_name,
              username: shortcode_media.owner.username,
              profile_pic: shortcode_media.owner.profile_pic_url,
            },
          };

          shortcode_media.edge_media_to_tagged_user.edges.map((user) => {
            resultBuilder.tagged_user.push(user.node.user);
          });

          shortcode_media.edge_media_to_parent_comment.edges.map((comment) => {
            let comment_builder = {
              comments_id: comment.node.id,
              comment_text: comment.node.text,
              owner: {
                instagram_id: comment.node.owner.id,
                username: comment.node.owner.username,
                profile_pic: comment.node.owner.profile_pic_url,
              },
              comment_likes: comment.node.edge_liked_by.count,
              sub_comments_total: comment.node.edge_threaded_comments.count,
              sub_comments: [],
            };

            comment.node.edge_threaded_comments.edges.map((sub_comment) => {
              comment_builder.sub_comments.push({
                sub_comments_id: sub_comment.node.id,
                sub_comment_text: sub_comment.node.text,
                owner: {
                  instagram_id: sub_comment.node.owner.id,
                  username: sub_comment.node.owner.username,
                  profile_pic: sub_comment.node.owner.profile_pic_url,
                },
                sub_comment_likes: sub_comment.node.edge_liked_by.count,
              });
            });

            resultBuilder.comments.push(comment_builder);
          });

          resolve(resultBuilder);
        },
      );
    });
  }
}

const ig = new Instagram();

ig.getUserProfile("fgsi_preset").then(console.log).catch(console.log);
//ig.getPostByHashtag("alightmotion").then(console.log).catch(console.log);
/*ig.getDetailPost("C8MuVNCh-3r").then(console.log).catch(console.log);
 */
module.exports = new Instagram();

function jsonToBody(json) {
  let body = "";
  for (let key in json) {
    if (json.hasOwnProperty(key)) {
      if (body.length > 0) {
        body += "&";
      }
      body += encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
    }
  }
  return body;
}
