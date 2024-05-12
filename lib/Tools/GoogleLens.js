const axios = require("axios");
const BodyForm = require("form-data");
const short1 = require("../Shorts/Shorter.Me.js");

const isUrl = (text) => {
  return text?.match(
    new RegExp(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/,
      "gi",
    ),
  );
};

function decodeEntities(encodedString) {
  var translate_re = /&(nbsp|amp|quot|lt|gt);/g;
  var translate = {
    nbsp: " ",
    amp: "&",
    quot: '"',
    lt: "<",
    gt: ">",
  };
  return encodedString
    .replace(translate_re, function (match, entity) {
      return translate[entity];
    })
    .replace(/&#(\d+);/gi, function (match, numStr) {
      var num = parseInt(numStr, 10);
      return String.fromCharCode(num);
    });
}

async function ToolGLens(image, isShort = true) {
  return new Promise(async (resolve) => {
    try {
      if (!image) resolve({ status: 404, msg: "No photo or URL provided" });
      if (!(image instanceof Buffer) && isUrl(image)) {
        const { url } = isShort
          ? await short1(`https://lens.google.com/uploadbyurl?url=${image}`)
          : { url: `https://lens.google.com/uploadbyurl?url=${image}` };
        resolve(global.resolveFSPR(url));
      } else {
        if (!(image instanceof Buffer)) {
          resolve({ status: 404, msg: "This is not a Buffer type" });
        }
        let data = new BodyForm();
        data.append("encoded_image", image, "screenshot.png");
        axios
          .post(
            "https://lens.google.com/upload?ep=ccm&s=&st=" + Date.now(),
            data,
            {
              headers: {
                ...data.getHeaders(),
              },
            },
          )
          .then(async ({ data }) => {
            const url_ =
              "https://lens.google.com" +
              decodeEntities(data.match(/<meta .*url=(\/search.*)"/)[1]);
            const { url } = isShort ? await short1(url_) : { url: url_ };
            resolve(global.resolveFSPR(url));
          })
          .catch((error) => {
            resolve(global.rejectFSPR(error));
          });
      }
    } catch (error) {
      resolve(global.rejectFSPR(error));
    }
  });
}

module.exports = ToolGLens;
