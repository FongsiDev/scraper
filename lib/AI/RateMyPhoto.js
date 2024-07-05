const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const AiRateMyPhoto = (imagePath) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!imagePath)
        resolve(global.rejectFSPR("Please Where is the Image Path"));
      const imageData = fs.readFileSync(path.join(imagePath), {
        encoding: "base64",
      });
      const form = new FormData();
      form.append("imageFile", "");
      form.append("canvasimg", "");
      form.append("image_data", `data:image/jpeg;base64,${imageData}`);
      await axios
        .post("https://rate-my-photo.com/result", form, {
          headers: {
            ...form.getHeaders(),
            authority: "rate-my-photo.com",
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "ms-MY,ms;q=0.9,en-US;q=0.8,en;q=0.7,id;q=0.6",
            "cache-control": "max-age=0",
            origin: "https://rate-my-photo.com",
            referer: "https://rate-my-photo.com/",
            "sec-ch-ua": '"Not)A;Brand";v="24", "Chromium";v="116"',
            "sec-ch-ua-arch": '""',
            "sec-ch-ua-bitness": '""',
            "sec-ch-ua-full-version-list":
              '"Not)A;Brand";v="24.0.0.0", "Chromium";v="116.0.5845.240"',
            "sec-ch-ua-mobile": "?1",
            "sec-ch-ua-model": "220333QAG",
            "sec-ch-ua-platform": '"Android"',
            "sec-ch-ua-platform-version": '"11.0.0"',
            "sec-ch-ua-wow64": "?0",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "user-agent":
              "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
          },
        })
        .then(({ data }) => {
          const $ = cheerio.load(data);
          const score = $(".skill_out .skill.html")
            ?.first()
            ?.text()
            ?.trim()
            .replace(/SCORE: /, "");
          const comparison = $(".skill_out .skill.html")
            ?.last()
            ?.text()
            ?.trim();
          const ratingText = $("p.mt-3")?.last()?.text()?.trim() || null;
          resolve(
            global.resolveFSPR({
              score,
              comparison,
              ratingText,
            }),
          );
        })
        .catch((error) => {
          resolve(global.rejectFSPR(error));
        });
    } catch (error) {
      resolve(global.rejectFSPR(error));
    }
  });
};
module.exports = AiRateMyPhoto;
