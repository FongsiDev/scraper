const axios = require("axios");
const FormData = require("form-data");
const getfile = require("getfile-fs");

function ToolRemoveBg(imagePath) {
  return new Promise(async (resolve, reject) => {
    try {
      if(!imagePath) resolve({ status: 404, msg: "Please Where is the Image Path or URL?"});
      // Langkah pertama: Dapatkan URL host
      const responseHost = await axios.get(
        "https://www.onlineconverter.com/get/host",
        {
          headers: {
            authority: "www.onlineconverter.com",
            accept: "*/*",
            "accept-language": "ms-MY,ms;q=0.9,en-US;q=0.8,en;q=0.7,id;q=0.6",
            referer: "https://www.onlineconverter.com/remove-image-background",
            "sec-ch-ua": '"Not)A;Brand";v="24", "Chromium";v="116"',
            "sec-ch-ua-mobile": "?1",
            "sec-ch-ua-platform": '"Android"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent":
              "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
          },
        }
      );

      const urlHost = responseHost.data;
      const imageBuffer = (await getfile(imagePath));
      if(imageBuffer.res?.status !== 200) resolve({status: 404, msg: imageBuffer.res?.statusText})
      // Langkah kedua: Upload gambar
      const form = new FormData();
      form.append("file", imageBuffer.data, { filename: `${Date.now()}.${imageBuffer.ext}`});
      form.append("select", "1");
      form.append("class", "tool");
      form.append("from", "image");
      form.append("to", "remove-image-background");
      form.append("source", "online");

      const responseUpload = await axios.post(urlHost, form, {
        headers: {
          ...form.getHeaders(),
          authority: urlHost,
          accept: "*/*",
          "accept-language": "ms-MY,ms;q=0.9,en-US;q=0.8,en;q=0.7,id;q=0.6",
          origin: "https://www.onlineconverter.com",
          referer: "https://www.onlineconverter.com/",
          "sec-ch-ua": '"Not)A;Brand";v="24", "Chromium";v="116"',
          "sec-ch-ua-mobile": "?1",
          "sec-ch-ua-platform": '"Android"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "user-agent":
            "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
        },
      });
      const resultUrl = responseUpload.data;
      const id = resultUrl.match(/(?:convert\/)(\w+)/)[1];
      const newUrl = `${urlHost.split("/send").join("")}/${id}`;
      const responseDownload = await axios.get(newUrl, {
        headers: {
          authority: urlHost,
          accept: "*/*",
          "accept-language": "ms-MY,ms;q=0.9,en-US;q=0.8,en;q=0.7,id;q=0.6",
          origin: "https://www.onlineconverter.com",
          referer: "https://www.onlineconverter.com/",
          "sec-ch-ua": '"Not)A;Brand";v="24", "Chromium";v="116"',
          "sec-ch-ua-mobile": "?1",
          "sec-ch-ua-platform": '"Android"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "user-agent":
            "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
        },
      });
      // Membuat URL baru dengan ID
      resolve({ status: 200, url: newUrl + "/download"});
    } catch (error) {
      resolve({status: 404, msg: error?.message ? error.message : error});
    }
  });
}

module.exports = ToolRemoveBg;